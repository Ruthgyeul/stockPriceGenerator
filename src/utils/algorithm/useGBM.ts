import type { AlgorithmParams } from './algorithmParams';
import { seededRandom } from '../seed';
import { minMaxCheck} from '../minMaxCheck';
import { killStock } from "../killStock";
import { outputType } from "../outputType";

export function GBM({ currentPrice, volatility = 0.1, drift = 0.05, seed = (Date.now() + new Date().getMilliseconds()), min = 0, max = 0, delisting = false, dataType = 'float' }: AlgorithmParams): number {
    const dt = 1 / 365;

    const u1 = seededRandom(seed);
    const u2 = seededRandom(seed + 1); // ensure different seed
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // standard normal

    const change = Math.exp(
        (drift - 0.5 * volatility * volatility) * dt +
        volatility * Math.sqrt(dt) * z
    );

    let nextPrice = currentPrice * change;

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
