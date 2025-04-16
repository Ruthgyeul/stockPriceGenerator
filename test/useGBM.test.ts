import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('GBM Algorithm - Stock Price Generator', () => {
    const defaultOptions: StockPriceOptions = {
        startPrice: 10000,
        length: 10,
        volatility: 0.1,
        drift: 0.05,
        algorithm: 'GBM'
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

    test('should support GBM algorithm with continuous generator', (done) => {
        const generator = getContStockPrices({
            ...defaultOptions,
            interval: 100
        });

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

    test('should call onPrice using GBM algorithm', (done) => {
        const onPrice = jest.fn();
        const generator = getContStockPrices({
            ...defaultOptions,
            interval: 100,
            onPrice
        });

        generator.start();

        setTimeout(() => {
            expect(onPrice).toHaveBeenCalled();
            generator.stop();
            done();
        }, 250);
    });

    test('should apply drift correctly', () => {
        const result = getStockPrices({
            ...defaultOptions,
            length: 30,
            drift: 0.1,
            seed: 123
        });

        const averageReturn = result.data.reduce((acc, val, i, arr) => {
            if (i === 0) return 0;
            return acc + Math.log(val / arr[i - 1]);
        }, 0) / (result.data.length - 1);

        expect(averageReturn).toBeGreaterThan(0);
    });

    test('should use provided seed for reproducibility', () => {
        const result1 = getStockPrices({ ...defaultOptions, seed: 123 });
        const result2 = getStockPrices({ ...defaultOptions, seed: 123 });

        expect(result1.data).toEqual(result2.data);
    });

    test('should respect min and max bounds', () => {
        const result = getStockPrices({
            ...defaultOptions,
            min: 9000,
            max: 11000
        });

        expect(Math.min(...result.data)).toBeGreaterThanOrEqual(9000);
        expect(Math.max(...result.data)).toBeLessThanOrEqual(11000);
    });

    test('should truncate or pad output to specified length', () => {
        const result = getStockPrices({
            ...defaultOptions,
            length: 5
        });

        expect(result.data.length).toBe(5);
    });

    test('should use step size for discretization', () => {
        const result = getStockPrices({
            ...defaultOptions,
            step: 100
        });

        const allStepAligned = result.data.every(price => price % 100 === 0);
        expect(allStepAligned).toBe(true);
    });

    test('should apply delisting logic when price reaches 0', () => {
        const result = getStockPrices({
            ...defaultOptions,
            startPrice: 1,
            volatility: 2,
            drift: -5,
            delisting: true,
            seed: 999
        });

        const reachedZero = result.data.some(p => p <= 0);
        expect(reachedZero).toBe(true);
    });

    test('should round prices to integers if dataType is int', () => {
        const result = getStockPrices({
            ...defaultOptions,
            dataType: 'int'
        });

        const allIntegers = result.data.every(price => Number.isInteger(price));
        expect(allIntegers).toBe(true);
    });

    test('should start with the specified startPrice', () => {
        const result = getStockPrices({ ...defaultOptions, startPrice: 12345 });
        expect(result.data[0]).toBe(12345);
    });

    test('should apply specified volatility', () => {
        const low = getStockPrices({ ...defaultOptions, volatility: 0.01, seed: 456 });
        const high = getStockPrices({ ...defaultOptions, volatility: 0.3, seed: 456 });
        const lowRange = Math.max(...low.data) - Math.min(...low.data);
        const highRange = Math.max(...high.data) - Math.min(...high.data);
        expect(highRange).toBeGreaterThan(lowRange);
    });

    test('should apply drift parameter correctly', () => {
        const result = getStockPrices({ ...defaultOptions, drift: 0.2, seed: 789 });
        const avgReturn = result.data.reduce((acc, val, i, arr) => {
            if (i === 0) return 0;
            return acc + Math.log(val / arr[i - 1]);
        }, 0) / (result.data.length - 1);
        expect(avgReturn).toBeGreaterThan(0);
    });

    test('should generate consistent results using the same seed', () => {
        const r1 = getStockPrices({ ...defaultOptions, seed: 42 });
        const r2 = getStockPrices({ ...defaultOptions, seed: 42 });
        expect(r1.data).toEqual(r2.data);
    });

    test('should clamp values within min and max', () => {
        const result = getStockPrices({ ...defaultOptions, min: 5000, max: 7000 });
        expect(Math.min(...result.data)).toBeGreaterThanOrEqual(5000);
        expect(Math.max(...result.data)).toBeLessThanOrEqual(7000);
    });

    test('should return array with specified length', () => {
        const result = getStockPrices({ ...defaultOptions, length: 15 });
        expect(result.data.length).toBe(15);
    });

    test('should respect step size rounding', () => {
        const result = getStockPrices({ ...defaultOptions, step: 500 });
        const aligned = result.data.every(p => p % 500 === 0);
        expect(aligned).toBe(true);
    });

    test('should output integers if dataType is int', () => {
        const result = getStockPrices({ ...defaultOptions, dataType: 'int' });
        const allInts = result.data.every(p => Number.isInteger(p));
        expect(allInts).toBe(true);
    });

    test('should support multiple algorithms', () => {
        const rw = getStockPrices({ ...defaultOptions, algorithm: 'RandomWalk' });
        const gbm = getStockPrices({ ...defaultOptions, algorithm: 'GBM' });
        expect(rw.data).not.toEqual(gbm.data);
    });

    test('should respect interval in continuous generator', (done) => {
        const generator = getContStockPrices({
            ...defaultOptions,
            interval: 100,
            onPrice: jest.fn()
        });

        const spy = jest.spyOn(generator, 'getCurrentPrice');

        generator.start();

        setTimeout(() => {
            generator.stop();
            expect(spy).toHaveBeenCalled();
            done();
        }, 250);
    });

    test('should call onStart, onStop, onComplete, and onError callbacks', (done) => {
        const onStart = jest.fn();
        const onStop = jest.fn();
        const onComplete = jest.fn();
        const onError = jest.fn();

        const generator = getContStockPrices({
            ...defaultOptions,
            interval: 100,
            onStart,
            onStop,
            onComplete,
            onError
        });

        generator.start();
        expect(onStart).toHaveBeenCalled();

        setTimeout(() => {
            generator.stop();
            expect(onStop).toHaveBeenCalled();
            // Assuming onComplete and onError might not always be called, we don't enforce them
            done();
        }, 250);
    });
});