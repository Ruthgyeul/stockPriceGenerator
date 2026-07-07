import { killStock } from '../src/utils/killStock';

describe('killStock', () => {
    test('leaves a healthy price untouched', () => {
        expect(killStock(100)).toBe(100);
        expect(killStock(0.5)).toBe(0.5);
    });

    test('zeroes out a price at or below the default near-zero threshold (0.01)', () => {
        expect(killStock(0.01)).toBe(0);
        expect(killStock(0.001)).toBe(0);
        expect(killStock(0)).toBe(0);
    });

    test('zeroes out a negative price', () => {
        expect(killStock(-5)).toBe(0);
    });

    test('leaves a price just above the default threshold untouched', () => {
        expect(killStock(0.011)).toBe(0.011);
    });

    test('honors a custom threshold', () => {
        expect(killStock(5, 10)).toBe(0);
        expect(killStock(15, 10)).toBe(15);
    });
});
