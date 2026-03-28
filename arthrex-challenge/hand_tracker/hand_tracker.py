#!/usr/bin/env python3
"""
Hand Tracking Sidecar — MediaPipe Hands + WebSocket
Streams gesture state to the React frontend at ws://localhost:8765

Gesture mapping:
  Both index fingers extended, move apart/together  -> zoom in/out
  Open palm + drag                                   -> rotate on X/Y axes
  Closed fist held 1 s                               -> reset model to default pose

Usage:
  pip install -r requirements.txt
  python hand_tracker.py
"""

import asyncio
import threading
import json
import math
import time
import sys
import cv2
import mediapipe as mp
import websockets

# ── Config ─────────────────────────────────────────────────────────────────

WS_HOST    = "localhost"
WS_PORT    = 8765
TARGET_FPS = 30

# MediaPipe landmark indices
WRIST     = 0
INDEX_TIP = 8
INDEX_MCP = 5
PINKY_MCP = 17

# Two-index zoom
INDEX_ZOOM_SCALE = 4.0    # delta of index-tip distance → zoom rate

# Ordered tip / PIP pairs for finger extension detection (index→pinky)
FINGER_TIPS = [8, 12, 16, 20]
FINGER_PIPS = [6, 10, 14, 18]

FIST_HOLD_SECS = 1.0

# Per-second rate scales sent to the frontend
ZOOM_RATE_SCALE   = 4.0
ROTATE_RATE_SCALE = 3.5

# Dead zones — deltas below these are treated as noise and ignored
ZOOM_DEAD   = 0.003   # normalised palm-centre distance change
ROTATE_DEAD = 0.004   # normalised palm-centre position change

# EMA smoothing — lower alpha = smoother but more lag
RATE_EMA_ALPHA = 0.4

# Rate clamp — prevents single-frame detection spikes reaching the frontend
MAX_RATE = 5.0

# Gesture debouncer thresholds (frames)
GESTURE_ENTER_FRAMES = 3   # consecutive frames required to activate a gesture
GESTURE_EXIT_FRAMES  = 5   # consecutive frames of absence required to deactivate

# Camera: consecutive read failures before triggering a gesture state reset
MAX_FRAME_FAILURES = 10

# ── Shared state ───────────────────────────────────────────────────────────

shared_state: dict = {
    "gesture":     None,
    "hands":       0,
    "zoomRate":    0.0,
    "spinYRate":   0.0,   # reserved for future spin gesture; always 0 for now
    "rotateXRate": 0.0,
    "rotateYRate": 0.0,
    "reset":       False,
}
state_lock = threading.Lock()
running    = True

# ── EMA smoothing state ─────────────────────────────────────────────────────

_smooth_vals: dict        = {k: 0.0 for k in ("zoomRate", "rotateXRate", "rotateYRate")}
_prev_smooth_gesture: str | None = None


def _apply_smooth(update: dict) -> None:
    """Apply EMA to rate values in-place; reset accumulators on gesture change."""
    global _prev_smooth_gesture
    gesture = update.get("gesture")
    if gesture != _prev_smooth_gesture:
        for k in _smooth_vals:
            _smooth_vals[k] = 0.0
    _prev_smooth_gesture = gesture
    for k in _smooth_vals:
        if k in update:
            _smooth_vals[k] = RATE_EMA_ALPHA * update[k] + (1.0 - RATE_EMA_ALPHA) * _smooth_vals[k]
            update[k] = _smooth_vals[k]


def _clamp_rates(update: dict) -> None:
    """Clamp rate values to ±MAX_RATE before EMA to suppress frame-spike jitter."""
    for k in ("zoomRate", "rotateXRate", "rotateYRate"):
        if k in update:
            update[k] = max(-MAX_RATE, min(MAX_RATE, update[k]))


# ── Geometry helpers ───────────────────────────────────────────────────────

def dist2d(a, b) -> float:
    return math.hypot(a.x - b.x, a.y - b.y)


def finger_extended(lm, tip_idx: int, pip_idx: int) -> bool:
    """Fingertip farther from wrist than PIP joint → extended."""
    return dist2d(lm[WRIST], lm[tip_idx]) > dist2d(lm[WRIST], lm[pip_idx]) * 1.1


def palm_center(lm) -> tuple[float, float]:
    """Stable palm anchor: average of wrist, index MCP, pinky MCP.
    More robust than wrist alone for two-hand distance measurement."""
    return (
        (lm[WRIST].x + lm[INDEX_MCP].x + lm[PINKY_MCP].x) / 3,
        (lm[WRIST].y + lm[INDEX_MCP].y + lm[PINKY_MCP].y) / 3,
    )


def index_extended(lm) -> bool:
    """Index finger extended on one hand."""
    return finger_extended(lm, FINGER_TIPS[0], FINGER_PIPS[0])


def is_closed_fist(lm) -> bool:
    return all(not finger_extended(lm, FINGER_TIPS[i], FINGER_PIPS[i]) for i in range(4))


def is_open_palm(lm) -> bool:
    """3 or more of the 4 fingers (index→pinky) extended → open hand.

    Most reliably detected MediaPipe state: maximum landmark spread means
    highest detection accuracy.  No contact point, no strict multi-finger
    curled requirement — just 'hand is open'.  Palm centre is tracked for
    position, and the dead zone handles an idle stationary open hand."""
    extended = sum(
        finger_extended(lm, FINGER_TIPS[i], FINGER_PIPS[i]) for i in range(4)
    )
    return extended >= 3


# ── Gesture debouncer ──────────────────────────────────────────────────────

class GestureDebouncer:
    """Hysteresis filter: require N consecutive frames to enter a gesture state
    and M consecutive frames of absence to leave it.  Prevents single-frame
    false positives from flickering gesture output."""

    def __init__(self, enter: int = GESTURE_ENTER_FRAMES, exit: int = GESTURE_EXIT_FRAMES):
        self._enter = enter
        self._exit  = exit
        self.active = False
        self._count = 0

    def update(self, raw: bool) -> bool:
        if self.active:
            # Already active: count down on absence, reset count on presence
            self._count = self._exit if raw else max(self._count - 1, 0)
            if self._count == 0:
                self.active = False
        else:
            # Not active: count up on presence, decay on absence
            self._count = min(self._count + 1, self._enter) if raw else max(self._count - 1, 0)
            if self._count >= self._enter:
                self.active = True
        return self.active

    def reset(self) -> None:
        self.active = False
        self._count = 0


# ── Per-hand temporal state ────────────────────────────────────────────────

class HandState:
    def __init__(self):
        self.prev_palm_x: float | None = None
        self.prev_palm_y: float | None = None
        self.fist_start:  float | None = None
        self.palm_dbc = GestureDebouncer()
        self.fist_dbc = GestureDebouncer()

    def clear(self):
        self.prev_palm_x = None
        self.prev_palm_y = None
        self.fist_start  = None
        self.palm_dbc.reset()
        self.fist_dbc.reset()


_hand_states        = [HandState(), HandState()]
_prev_index_dist:  float | None = None
_index_zoom_dbc    = GestureDebouncer(enter=2, exit=4)


# ── Gesture processing ─────────────────────────────────────────────────────

def _reset_rates() -> dict:
    return {
        "gesture":     None,
        "zoomRate":    0.0,
        "spinYRate":   0.0,
        "rotateXRate": 0.0,
        "rotateYRate": 0.0,
        "reset":       False,
    }


def process_frame(multi_hand_lm) -> None:
    global _prev_index_dist

    update = _reset_rates()
    update["hands"] = len(multi_hand_lm) if multi_hand_lm else 0

    if not multi_hand_lm:
        _prev_index_dist = None
        for hs in _hand_states:
            hs.clear()
        _index_zoom_dbc.reset()
        for k in _smooth_vals:
            _smooth_vals[k] = 0.0
        with state_lock:
            shared_state.update(update)
        return

    n = len(multi_hand_lm)

    # ── Two-index zoom (takes priority when both hands are present) ────────
    # Both index fingers extended → distance between their tips drives zoom.
    # Index tips are the most accurate landmarks when the finger is fully
    # extended, and the gesture is intentional enough to avoid false triggers.
    if n >= 2:
        lm0 = multi_hand_lm[0].landmark
        lm1 = multi_hand_lm[1].landmark
        both_pointing = index_extended(lm0) and index_extended(lm1)

        if _index_zoom_dbc.update(both_pointing) and both_pointing:
            d = dist2d(lm0[INDEX_TIP], lm1[INDEX_TIP])
            if _prev_index_dist is not None:
                delta = d - _prev_index_dist
                if abs(delta) > ZOOM_DEAD:
                    update["gesture"]  = "index_zoom"
                    update["zoomRate"] = delta * INDEX_ZOOM_SCALE * TARGET_FPS
            _prev_index_dist = d
            _clamp_rates(update)
            _apply_smooth(update)
            with state_lock:
                shared_state.update(update)
            return
        elif not both_pointing:
            _index_zoom_dbc.update(False)
            _prev_index_dist = None
    else:
        _index_zoom_dbc.update(False)
        _prev_index_dist = None

    # ── Single-hand gestures (first detected hand) ─────────────────────────
    lm = multi_hand_lm[0].landmark
    hs = _hand_states[0]

    # 1. Open palm + drag → rotate
    #    3+ fingers extended → track palm centre.  Most stable MediaPipe state:
    #    maximum landmark spread means highest detection accuracy.  No contact
    #    point or strict per-finger state required.  Idle open hand is handled
    #    by the dead zone.
    if hs.palm_dbc.update(is_open_palm(lm)):
        px, py = palm_center(lm)

        if hs.prev_palm_x is not None:
            dx = px - hs.prev_palm_x
            dy = py - hs.prev_palm_y
            if abs(dx) > ROTATE_DEAD or abs(dy) > ROTATE_DEAD:
                update["gesture"]     = "palm_rotate"
                update["rotateYRate"] = dx * ROTATE_RATE_SCALE * TARGET_FPS
                update["rotateXRate"] = dy * ROTATE_RATE_SCALE * TARGET_FPS

        hs.prev_palm_x = px
        hs.prev_palm_y = py
        hs.fist_start  = None
        _clamp_rates(update)
        _apply_smooth(update)
        with state_lock:
            shared_state.update(update)
        return

    hs.prev_palm_x = None
    hs.prev_palm_y = None

    # 2. Closed fist → reset after 1 s hold
    if hs.fist_dbc.update(is_closed_fist(lm)):
        now = time.time()
        if hs.fist_start is None:
            hs.fist_start = now
        elif now - hs.fist_start >= FIST_HOLD_SECS:
            update["gesture"] = "reset"
            update["reset"]   = True
            hs.fist_start     = now + 9999   # block repeat until fist released
        else:
            update["gesture"] = "fist_holding"
    else:
        hs.fist_start = None

    _clamp_rates(update)
    _apply_smooth(update)
    with state_lock:
        shared_state.update(update)


# ── Camera capture thread ──────────────────────────────────────────────────

def camera_loop() -> None:
    global running

    mp_hands = mp.solutions.hands
    hands    = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.6,
    )
    draw_utils = mp.solutions.drawing_utils

    # On macOS, explicitly use AVFoundation backend to trigger the system
    # camera-permission dialog and avoid silent permission failures.
    if sys.platform == "darwin":
        cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)
    else:
        cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    if not cap.isOpened():
        print("[hand_tracker] ERROR: Could not open camera.")
        if sys.platform == "darwin":
            print("[hand_tracker] macOS: grant Camera access to Terminal (or your IDE) in")
            print("               System Settings → Privacy & Security → Camera, then retry.")
        running = False
        return

    print("[hand_tracker] Camera ready. Press 'q' in the preview window to quit.")

    consecutive_failures = 0

    while running:
        ok, frame = cap.read()
        if not ok:
            consecutive_failures += 1
            if consecutive_failures >= MAX_FRAME_FAILURES:
                print(f"[hand_tracker] WARNING: {consecutive_failures} consecutive frame read "
                      "failures — resetting gesture state.")
                process_frame(None)
                consecutive_failures = 0
            continue
        consecutive_failures = 0

        frame = cv2.flip(frame, 1)                          # mirror so it feels natural
        rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res   = hands.process(rgb)

        process_frame(res.multi_hand_landmarks)

        # Visual feedback overlay
        if res.multi_hand_landmarks:
            for hand_lm in res.multi_hand_landmarks:
                draw_utils.draw_landmarks(frame, hand_lm, mp_hands.HAND_CONNECTIONS)

        with state_lock:
            gesture = shared_state.get("gesture") or "—"
            n_hands = shared_state.get("hands", 0)

        cv2.putText(frame, f"Hands: {n_hands}  Gesture: {gesture}",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 230, 80), 2)
        cv2.putText(frame, "ws://localhost:8765",
                    (10, 460), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (120, 120, 120), 1)

        cv2.imshow("Hand Tracker — Arthrex", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            running = False
            break

    cap.release()
    cv2.destroyAllWindows()
    hands.close()


# ── WebSocket server ───────────────────────────────────────────────────────

async def ws_handler(websocket) -> None:
    addr = getattr(websocket, "remote_address", "unknown")
    print(f"[hand_tracker] Client connected: {addr}")
    interval = 1.0 / TARGET_FPS
    try:
        while True:
            with state_lock:
                payload = dict(shared_state)
            await websocket.send(json.dumps(payload))
            await asyncio.sleep(interval)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        print(f"[hand_tracker] Client disconnected: {addr}")


async def ws_serve_main():
    global running
    print(f"[hand_tracker] WebSocket server on ws://{WS_HOST}:{WS_PORT}")
    async with websockets.serve(ws_handler, WS_HOST, WS_PORT):
        while running:
            await asyncio.sleep(0.1)
    print("[hand_tracker] WebSocket server stopped.")


def start_ws_server():
    asyncio.run(ws_serve_main())


if __name__ == "__main__":
    try:
        ws_thread = threading.Thread(target=start_ws_server, daemon=True)
        ws_thread.start()

        # Run camera + OpenCV GUI on the main thread (macOS requires this)
        camera_loop()

        running = False
        ws_thread.join(timeout=1.0)
        print("[hand_tracker] Exiting cleanly.")

    except KeyboardInterrupt:
        running = False
        print("\n[hand_tracker] Interrupted by user.")
