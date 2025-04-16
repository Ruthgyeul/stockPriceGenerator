import type { AlgorithmParams } from './algorithmParams';
import { seededRandom } from '../seed';
import { minMaxCheck } from '../minMaxCheck';
import { killStock } from '../killStock';
import { outputType } from "../outputType";

export function RandomWalk({ currentPrice, volatility = 0.1, drift = 0.05, seed, min = 0, max = 0, delisting = false, dataType = 'float' }: AlgorithmParams): number {
    const random = seededRandom(seed);
    const epsilon = (random - 0.5) * 2; // scale to [-1, 1]
    const dt = 1 / 365;

    const driftTerm = (drift - 0.5 * volatility ** 2) * dt;
    const diffusionTerm = volatility * Math.sqrt(dt) * epsilon;

    let nextPrice = currentPrice * Math.exp(driftTerm + diffusionTerm);

    // Check if delisting is enabled
    if (delisting) {
        // Delisting logic
        nextPrice = killStock(nextPrice);
    } else {
        // Check min and max limits
        nextPrice = minMaxCheck(min, max, nextPrice);
    }

    // Output with specified data type
    return outputType(nextPrice, dataType);
}
