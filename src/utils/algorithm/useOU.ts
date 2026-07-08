import type { AlgorithmParams } from './algorithmParams';
import { seededRandom } from '../seed';
import { minMaxCheck } from '../minMaxCheck';
import { killStock } from '../killStock';
import { outputType } from '../outputType';

// Ornstein-Uhlenbeck applied to log-price: dX = reversionSpeed * (ln(longTermMean) - X) * dt + volatility * sqrt(dt) * dW,
// then nextPrice = exp(X + dX). Working in log-space keeps volatility/reversionSpeed on the same relative
// scale as GBM/RandomWalk (instead of a fixed-dollar move) and keeps the price positive between ticks.
export function OU({ currentPrice, volatility = 0.1, longTermMean, reversionSpeed = 0.15, seed, min = 0, max = 0, delisting = false, dataType = 'float' }: AlgorithmParams): number {
    const dt = 1 / 365;
    const mu = Math.max(longTermMean ?? currentPrice, Number.EPSILON);

    const u1 = seededRandom(seed);
    const u2 = seededRandom(seed !== undefined ? seed + 1 : undefined); // ensure different seed
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // standard normal

    const logCurrent = Math.log(Math.max(currentPrice, Number.EPSILON));
    const logChange = reversionSpeed * (Math.log(mu) - logCurrent) * dt + volatility * Math.sqrt(dt) * z;

    let nextPrice = Math.exp(logCurrent + logChange);

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
