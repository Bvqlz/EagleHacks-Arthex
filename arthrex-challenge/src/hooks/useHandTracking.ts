import { useEffect, useRef } from 'react';
import { useGestureStore } from '../store/gestureStore';

const WS_URL          = 'ws://localhost:8765';
const RECONNECT_BASE  = 1000;   // ms — initial reconnect delay
const RECONNECT_MAX   = 30_000; // ms — backoff ceiling
const STALE_THRESHOLD = 200;    // ms — zero rates if no message received within this window

// Rates below this threshold are treated as noise and zeroed out
const RATE_DEAD = 0.06;

/**
 * Connects to the Python hand-tracking sidecar WebSocket and pipes gesture
 * state into the Zustand gestureStore.
 *
 * - Reconnects automatically with exponential backoff (1 s → 30 s ceiling).
 * - Zeros all rates if messages stop arriving for >200 ms (e.g. Python thread
 *   stalls while the socket remains open), preventing stuck motion.
 */
export function useHandTracking() {
  const wsRef        = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const staleRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const destroyedRef = useRef(false);
  const attemptRef   = useRef(0);
  const lastMsgRef   = useRef(0);
  const { update, setConnected } = useGestureStore();

  useEffect(() => {
    destroyedRef.current = false;
    attemptRef.current   = 0;

    function connect() {
      if (destroyedRef.current) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        attemptRef.current = 0;
        lastMsgRef.current = Date.now();
        setConnected(true);
      };

      ws.onmessage = (ev) => {
        lastMsgRef.current = Date.now();
        try {
          const d = JSON.parse(ev.data as string);
          const dz = (v: number) => Math.abs(v) < RATE_DEAD ? 0 : v;
          update({
            gesture:     d.gesture  ?? null,
            hands:       d.hands    ?? 0,
            zoomRate:    dz(d.zoomRate    ?? 0),
            spinYRate:   dz(d.spinYRate   ?? 0),
            rotateXRate: dz(d.rotateXRate ?? 0),
            rotateYRate: dz(d.rotateYRate ?? 0),
            reset:       d.reset    ?? false,
          });
        } catch {
          // malformed JSON — ignore
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (!destroyedRef.current) {
          // Exponential backoff: 1 s, 1.5 s, 2.25 s … capped at 30 s
          const delay = Math.min(
            RECONNECT_BASE * Math.pow(1.5, attemptRef.current),
            RECONNECT_MAX,
          );
          attemptRef.current += 1;
          reconnectRef.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => ws.close();
    }

    // Guard against a stalled Python thread: if the socket stays open but
    // messages stop arriving, zero all rates so the model doesn't keep drifting.
    staleRef.current = setInterval(() => {
      if (Date.now() - lastMsgRef.current > STALE_THRESHOLD) {
        update({ zoomRate: 0, spinYRate: 0, rotateXRate: 0, rotateYRate: 0 });
      }
    }, 100);

    connect();

    return () => {
      destroyedRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (staleRef.current)    clearInterval(staleRef.current);
      wsRef.current?.close();
    };
  // update / setConnected refs are stable — no re-run needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
