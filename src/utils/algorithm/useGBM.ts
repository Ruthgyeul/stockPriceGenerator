import type { AlgorithmParams } from './algorithmParams';
import { seededRandom } from '../seed';

export function GBM({ currentPrice, volatility, drift, seed = (Date.now() + new Date().getMilliseconds()) }: AlgorithmParams): number {
    const dt = 1 / 365;

    const u1 = seededRandom(seed);
    const u2 = seededRandom(seed + 1); // ensure different seed
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // standard normal

    const change = Math.exp(
        (drift - 0.5 * volatility * volatility) * dt +
        volatility * Math.sqrt(dt) * z
    );

    return currentPrice * change;
}
