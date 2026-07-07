import { seededRandom } from '../src/utils/seed';

describe('seededRandom', () => {
    test('produces the same value for the same seed', () => {
        expect(seededRandom(42)).toBe(seededRandom(42));
        expect(seededRandom(123456789)).toBe(seededRandom(123456789));
    });

    test('produces different values for different seeds', () => {
        expect(seededRandom(1)).not.toBe(seededRandom(2));
    });

    test('always returns a value in [0, 1)', () => {
        for (const seed of [0, 1, 42, 999, 123456789, -5]) {
            const value = seededRandom(seed);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    test('falls back to Math.random() (varies between calls) when no seed is given', () => {
        const values = new Set(Array.from({ length: 5 }, () => seededRandom(undefined)));
        expect(values.size).toBeGreaterThan(1);
    });
});
