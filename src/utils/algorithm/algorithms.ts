import { GBM } from './useGBM';
import { RandomWalk } from './useRandomWalk';

export const algorithms = {
    RandomWalk: RandomWalk,
    GBM: GBM
} as const;

export type Algorithm = keyof typeof algorithms;