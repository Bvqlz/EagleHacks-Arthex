# Hand Tracker

MediaPipe-based hand tracking sidecar that streams gesture state to the React frontend via WebSocket at `ws://localhost:8765`.

## Requirements

**Python 3.11 is required.** MediaPipe (`0.9.3`) is broken on Python 3.12+ and will fail to install or crash at runtime on Python 3.13. Do not use a newer Python version.

A virtual environment is also required to avoid dependency conflicts.

## Setup

```bash
# Create a Python 3.11 virtual environment
python3.11 -m venv .venv

# Activate it
source .venv/bin/activate        # macOS/Linux
# .venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

## Usage

```bash
# Make sure the venv is activated first
source .venv/bin/activate

python hand_tracker.py
```

A camera preview window will open. Press `q` in that window to quit.

## Gesture Reference

| Gesture | Action |
|---|---|
| Both index fingers extended, move apart / together | Zoom in / out |
| Open palm (3+ fingers extended) + drag | Rotate model on X/Y axes |
| Closed fist held 1 s | Reset model to default pose |
