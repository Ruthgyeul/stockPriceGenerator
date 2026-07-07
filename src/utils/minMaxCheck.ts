// A price that lands outside [min, max] is pulled back by a random fraction of the
// range (instead of being snapped straight to the boundary) so a bounded walk doesn't
// flatline on min/max every time it overshoots, then hard-clamped as a final guarantee.
export function minMaxCheck(min: number, max: number, price: number): number {
    if (min === 0 && max === 0) {
        return price;
    }

    if (price >= min && price <= max) {
        return price;
    }

    const range = max - min;
    const pullback = Math.random() * 0.1 * range;
    const adjusted = price < min ? price + pullback : price - pullback;

    return Math.min(Math.max(adjusted, min), max);
}
