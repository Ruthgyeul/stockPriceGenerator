// Structural option errors (bad startPrice/length/min-max) fail fast and synchronously,
// unlike per-tick algorithm errors (e.g. negative volatility) which surface later via onError.
export interface ValidatableOptions {
    startPrice: number;
    length?: number;
    min?: number;
    max?: number;
}

export function validateOptions({ startPrice, length, min = 0, max = 0 }: ValidatableOptions): void {
    if (startPrice < 0) {
        throw new Error('startPrice must be a non-negative number');
    }

    if (length !== undefined && length <= 0) {
        throw new Error('length must be a positive integer');
    }

    // (0, 0) is the documented "unbounded" sentinel, not a real min>max misconfiguration.
    if (!(min === 0 && max === 0) && min > max) {
        throw new Error('min must not be greater than max');
    }
}
