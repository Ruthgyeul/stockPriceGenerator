import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('OU (Ornstein-Uhlenbeck) Algorithm - Stock Price Generator', () => {
    const defaultOptions: StockPriceOptions = {
        startPrice: 10000,
        length: 10,
        volatility: 0.1,
        algorithm: 'OU'
    };

    test('should return correct data structure', () => {
        const result = getStockPrices(defaultOptions);
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('price');
        expect(Array.isArray(result.data)).toBe(true);
        expect(typeof result.price).toBe('number');
    });

    test('should generate correct number of length', () => {
        const result = getStockPrices(defaultOptions);
        expect(result.data.length).toBe(defaultOptions.length);
    });

    test('should use provided seed for reproducibility', () => {
        const result1 = getStockPrices({ ...defaultOptions, seed: 123 });
        const result2 = getStockPrices({ ...defaultOptions, seed: 123 });
        expect(result1.data).toEqual(result2.data);
    });

    test('should start with the specified startPrice', () => {
        const result = getStockPrices({ ...defaultOptions, startPrice: 12345 });
        expect(result.data[0]).toBe(12345);
    });

    test('should revert toward longTermMean over a long series', () => {
        const result = getStockPrices({
            startPrice: 20000,
            length: 2000,
            volatility: 0.2,
            algorithm: 'OU',
            longTermMean: 10000,
            reversionSpeed: 2,
            seed: 42
        });

        const last200 = result.data.slice(-200);
        const avgOfTail = last200.reduce((a, b) => a + b, 0) / last200.length;

        // Started far above the mean; a strongly mean-reverting series should end up much closer to it.
        expect(Math.abs(avgOfTail - 10000)).toBeLessThan(Math.abs(20000 - 10000));
    });

    test('should default longTermMean to startPrice when not provided', () => {
        const result = getStockPrices({
            startPrice: 10000,
            length: 500,
            volatility: 0.05,
            algorithm: 'OU',
            reversionSpeed: 2,
            seed: 7
        });

        const avg = result.data.reduce((a, b) => a + b, 0) / result.data.length;
        expect(Math.abs(avg - 10000)).toBeLessThan(2000);
    });

    test('should respect min and max bounds', () => {
        const result = getStockPrices({
            ...defaultOptions,
            length: 100,
            min: 9000,
            max: 11000
        });

        expect(Math.min(...result.data)).toBeGreaterThanOrEqual(9000);
        expect(Math.max(...result.data)).toBeLessThanOrEqual(11000);
    });

    test('should round prices to integers if dataType is int', () => {
        const result = getStockPrices({ ...defaultOptions, dataType: 'int' });
        expect(result.data.every(price => Number.isInteger(price))).toBe(true);
    });

    test('should apply delisting logic when price collapses', () => {
        const result = getStockPrices({
            ...defaultOptions,
            length: 20,
            startPrice: 1,
            longTermMean: 0.0001,
            reversionSpeed: 50,
            delisting: true,
            seed: 999
        });

        expect(result.data.some(p => p <= 0)).toBe(true);
    });

    test('should support the OU algorithm with a continuous generator', (done) => {
        const generator = getContStockPrices({ ...defaultOptions, interval: 100 });
        const initialPrice = generator.getCurrentPrice();
        generator.start();

        setTimeout(() => {
            const newPrice = generator.getCurrentPrice();
            expect(typeof newPrice).toBe('number');
            expect(newPrice).not.toBe(initialPrice);
            generator.stop();
            done();
        }, 250);
    });
});
