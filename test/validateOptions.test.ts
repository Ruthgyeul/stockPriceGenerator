import { getStockPrices, getContStockPrices } from '../src';

describe('input validation', () => {
    test('throws for a negative startPrice', () => {
        expect(() => getStockPrices({ startPrice: -1, length: 5 })).toThrow(
            'startPrice must be a non-negative number'
        );
        expect(() => getContStockPrices({ startPrice: -1 })).toThrow(
            'startPrice must be a non-negative number'
        );
    });

    test('throws for a zero or negative length', () => {
        expect(() => getStockPrices({ startPrice: 100, length: 0 })).toThrow(
            'length must be a positive integer'
        );
        expect(() => getStockPrices({ startPrice: 100, length: -5 })).toThrow(
            'length must be a positive integer'
        );
    });

    test('throws when min is greater than max', () => {
        expect(() => getStockPrices({ startPrice: 100, length: 5, min: 200, max: 100 })).toThrow(
            'min must not be greater than max'
        );
        expect(() => getContStockPrices({ startPrice: 100, min: 200, max: 100 })).toThrow(
            'min must not be greater than max'
        );
    });

    test('does not throw for the (0, 0) unbounded min/max sentinel', () => {
        expect(() => getStockPrices({ startPrice: 100, length: 5, min: 0, max: 0 })).not.toThrow();
    });

    test('does not throw for valid options', () => {
        expect(() => getStockPrices({ startPrice: 100, length: 5, min: 50, max: 150 })).not.toThrow();
    });
});
