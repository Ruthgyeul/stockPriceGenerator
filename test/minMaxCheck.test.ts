import { minMaxCheck } from '../src/utils/minMaxCheck';

describe('minMaxCheck', () => {
    test('returns the price unchanged when min and max are both 0 (unbounded)', () => {
        expect(minMaxCheck(0, 0, 999999)).toBe(999999);
        expect(minMaxCheck(0, 0, -999999)).toBe(-999999);
    });

    test('returns the price unchanged when it already sits within [min, max]', () => {
        expect(minMaxCheck(9000, 11000, 10000)).toBe(10000);
    });

    test('pulls a below-min price back up into [min, max]', () => {
        for (let i = 0; i < 50; i++) {
            const result = minMaxCheck(9000, 11000, 8000);
            expect(result).toBeGreaterThanOrEqual(9000);
            expect(result).toBeLessThanOrEqual(11000);
        }
    });

    test('pulls an above-max price back down into [min, max]', () => {
        for (let i = 0; i < 50; i++) {
            const result = minMaxCheck(9000, 11000, 12000);
            expect(result).toBeGreaterThanOrEqual(9000);
            expect(result).toBeLessThanOrEqual(11000);
        }
    });

    test('never returns a value outside [min, max], even for extreme overshoots', () => {
        for (let i = 0; i < 50; i++) {
            expect(minMaxCheck(9000, 11000, -1e9)).toBeGreaterThanOrEqual(9000);
            expect(minMaxCheck(9000, 11000, 1e9)).toBeLessThanOrEqual(11000);
        }
    });

    test('clamps to a single point when min equals max', () => {
        expect(minMaxCheck(10000, 10000, 8000)).toBe(10000);
        expect(minMaxCheck(10000, 10000, 12000)).toBe(10000);
    });

    test('respects an effectively min-only bound (large max, small price)', () => {
        const result = minMaxCheck(9000, 1_000_000, 100);
        expect(result).toBeGreaterThanOrEqual(9000);
        expect(result).toBeLessThanOrEqual(1_000_000);
    });
});
