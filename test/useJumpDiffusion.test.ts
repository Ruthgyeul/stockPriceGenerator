import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('JumpDiffusion Algorithm - Stock Price Generator', () => {
    const defaultOptions: StockPriceOptions = {
        startPrice: 10000,
        length: 10,
        volatility: 0.1,
        drift: 0.05,
        algorithm: 'JumpDiffusion'
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

    test('should produce larger jumps in the series when jumpIntensity is high', () => {
        const calm = getStockPrices({
            ...defaultOptions,
            length: 200,
            jumpIntensity: 0,
            seed: 55
        });
        const jumpy = getStockPrices({
            ...defaultOptions,
            length: 200,
            jumpIntensity: 500,
            jumpVolatility: 0.5,
            seed: 55
        });

        const maxStep = (data: number[]) =>
            Math.max(...data.slice(1).map((p, i) => Math.abs(Math.log(p / data[i]))));

        expect(maxStep(jumpy.data)).toBeGreaterThan(maxStep(calm.data));
    });

    test('should respect min and max bounds', () => {
        const result = getStockPrices({
            ...defaultOptions,
            length: 100,
            jumpIntensity: 50,
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
            startPrice: 1,
            volatility: 10,
            drift: -500,
            delisting: true,
            seed: 999
        });

        expect(result.data.some(p => p <= 0)).toBe(true);
    });

    test('should support the JumpDiffusion algorithm with a continuous generator', (done) => {
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
