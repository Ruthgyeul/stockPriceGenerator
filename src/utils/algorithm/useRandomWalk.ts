import { AlgorithmOptions } from './algorithmOptions';
import { seededRandom } from '../seed';

export function randomWalk({ currentPrice, volatility, drift, seed }: AlgorithmOptions): number {
    const random = seededRandom(seed);
    const change = (random - 0.5) * volatility * 0.1; // Reduce the impact of volatility
    const driftEffect = drift * (1 / 365); // Daily drift
    return currentPrice * (1 + change + driftEffect);
}
