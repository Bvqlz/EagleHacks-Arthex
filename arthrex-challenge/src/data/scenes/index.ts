import type { SceneConfig } from './types';
import { kneeScene } from './knee';
import { hipScene } from './hip';
import { ankleScene } from './ankle';

export type { SceneConfig, JointStructure, CameraPosition, ProcedureStep } from './types';

export const scenes: Record<string, SceneConfig> = {
  knee: kneeScene,
  hip: hipScene,
  ankle: ankleScene,
};

export const defaultSceneId = 'knee';
