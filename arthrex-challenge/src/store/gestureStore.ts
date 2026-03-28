import { create } from 'zustand';

/** Gesture rates are per-second values; CameraController scales by delta-time. */
export interface GestureRates {
  zoomRate:    number;   // camera distance change rate (pos = zoom in)
  spinYRate:   number;   // rad/s around world Y axis
  rotateXRate: number;   // rad/s pitch (around camera right)
  rotateYRate: number;   // rad/s yaw (around world Y)
}

interface GestureStore extends GestureRates {
  connected: boolean;
  gesture:   string | null;
  hands:     number;
  reset:     boolean;

  update:      (partial: Partial<GestureStore>) => void;
  setConnected:(v: boolean) => void;
  consumeReset:() => void;
}

export const useGestureStore = create<GestureStore>((set) => ({
  connected:   false,
  gesture:     null,
  hands:       0,
  zoomRate:    0,
  spinYRate:   0,
  rotateXRate: 0,
  rotateYRate: 0,
  reset:       false,

  update:       (partial) => set(partial),
  setConnected: (v)       => set({ connected: v }),
  consumeReset: ()        => set({ reset: false }),
}));
