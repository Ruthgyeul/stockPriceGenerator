import type { AlgorithmParams } from './algorithmParams';
import { seededRandom } from '../seed';
import { minMaxCheck } from '../minMaxCheck';
import { killStock } from '../killStock';
import { outputType } from '../outputType';

// Merton jump-diffusion: standard GBM diffusion plus an occasional Poisson-driven jump,
// so the series can spike/crash instead of only ever drifting smoothly like GBM.
export function JumpDiffusion({ currentPrice, volatility = 0.1, drift = 0.05, seed, min = 0, max = 0, delisting = false, dataType = 'float', jumpIntensity = 1, jumpMean = 0, jumpVolatility = 0.1 }: AlgorithmParams): number {
    const dt = 1 / 365;

    const u1 = seededRandom(seed);
    const u2 = seededRandom(seed !== undefined ? seed + 1 : undefined); // ensure different seed
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // standard normal

    const diffusion = Math.exp(
        (drift - 0.5 * volatility * volatility) * dt +
        volatility * Math.sqrt(dt) * z
    );

    // A jump fires this tick with probability jumpIntensity * dt (Poisson thinning for small dt).
    const jumpDraw = seededRandom(seed !== undefined ? seed + 2 : undefined);
    let jump = 1;
    if (jumpDraw < jumpIntensity * dt) {
        const j1 = seededRandom(seed !== undefined ? seed + 3 : undefined);
        const j2 = seededRandom(seed !== undefined ? seed + 4 : undefined);
        const jumpZ = Math.sqrt(-2.0 * Math.log(j1)) * Math.cos(2.0 * Math.PI * j2);
        jump = Math.exp(jumpMean + jumpVolatility * jumpZ);
    }

    let nextPrice = currentPrice * diffusion * jump;

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
