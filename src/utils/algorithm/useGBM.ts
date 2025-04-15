import { AlgorithmOptions } from './algorithmOptions';
import { seededRandom } from '../seed';

export function GBM({ currentPrice, volatility, drift, seed }: AlgorithmOptions): number {
    const dt = 1 / 365; // daily time step
    const random = seededRandom(seed);
    const change = Math.exp(
        (drift - 0.5 * volatility * volatility) * dt +
        volatility * Math.sqrt(dt) * (random * 2 - 1)
    );
    return currentPrice * change;
}
