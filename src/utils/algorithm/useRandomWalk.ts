import { AlgorithmParams } from './algorithmParams';
import { seededRandom } from '../seed';

export function RandomWalk({ currentPrice, volatility, drift, seed }: AlgorithmParams): number {
    const random = seededRandom(seed);
    const epsilon = (random - 0.5) * 2; // scale to [-1, 1]
    const dt = 1 / 365;

    const driftTerm = (drift - 0.5 * volatility ** 2) * dt;
    const diffusionTerm = volatility * Math.sqrt(dt) * epsilon;

    const nextPrice = currentPrice * Math.exp(driftTerm + diffusionTerm);
    return nextPrice;
}
