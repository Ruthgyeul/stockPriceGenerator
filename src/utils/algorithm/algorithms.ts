import { GBM } from './useGBM';
import { RandomWalk } from './useRandomWalk';
import { OU } from './useOU';
import { JumpDiffusion } from './useJumpDiffusion';

export const algorithms = {
    RandomWalk: RandomWalk,
    GBM: GBM,
    OU: OU,
    JumpDiffusion: JumpDiffusion
} as const;

export type Algorithm = keyof typeof algorithms;
