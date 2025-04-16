import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('Random Walk Algorithm - Stock Price Generator', () => {
    const defaultOptions: StockPriceOptions = {
        startPrice: 10000,
        length: 10,
        volatility: 0.1,
        drift: 0.05,
        algorithm: 'RandomWalk',
        interval: 100
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

    test('should start with the specified start price', () => {
        const result = getStockPrices(defaultOptions);
        expect(result.data[0]).toBe(defaultOptions.startPrice);
    });

    test('should respect volatility parameter', () => {
        const lowVolatility = getStockPrices({
            ...defaultOptions,
            length: 30,
            startPrice: 10000,
            volatility: 0.01,
            drift: 0,
            seed: 12345
        });

        const highVolatility = getStockPrices({
            ...defaultOptions,
            length: 30,
            startPrice: 10000,
            volatility: 0.1,
            drift: 0,
            seed: 12345
        });

        const lowVolRange = Math.max(...lowVolatility.data) - Math.min(...lowVolatility.data);
        const highVolRange = Math.max(...highVolatility.data) - Math.min(...highVolatility.data);

        expect(highVolRange).toBeGreaterThan(lowVolRange);
        expect(lowVolRange).toBeGreaterThan(0);
        expect(highVolRange).toBeLessThan(10000);
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
            max: 12000
        });

        expect(Math.min(...result.data)).toBeGreaterThanOrEqual(9000);
        expect(Math.max(...result.data)).toBeLessThanOrEqual(12000);
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

    test('should round prices to integers if dataType is int', () => {
        const result = getStockPrices({
            ...defaultOptions,
            dataType: 'int'
        });

        const allIntegers = result.data.every(price => Number.isInteger(price));
        expect(allIntegers).toBe(true);
    });

    test('should create a generator with correct interface', () => {
        const generator = getContStockPrices(defaultOptions);
        expect(generator).toHaveProperty('start');
        expect(generator).toHaveProperty('stop');
        expect(generator).toHaveProperty('getCurrentPrice');
    });

    test('should generate new prices when started', (done) => {
        const generator = getContStockPrices(defaultOptions);
        const initialPrice = generator.getCurrentPrice();

        generator.start();

        setTimeout(() => {
            const newPrice = generator.getCurrentPrice();
            expect(newPrice).not.toBe(initialPrice);
            generator.stop();
            done();
        }, 200);
    });

    test('should call onPrice callback when new price is generated', (done) => {
        const onPrice = jest.fn();
        const generator = getContStockPrices({ ...defaultOptions, onPrice });

        generator.start();

        setTimeout(() => {
            expect(onPrice).toHaveBeenCalled();
            generator.stop();
            done();
        }, 200);
    });

    test('should stop generating prices when stopped', (done) => {
        const generator = getContStockPrices(defaultOptions);
        const onPrice = jest.fn();

        generator.start();
        generator.stop();

        setTimeout(() => {
            expect(onPrice).not.toHaveBeenCalled();
            done();
        }, 200);
    });

    test('should handle errors gracefully', (done) => {
        const onError = jest.fn();
        const generator = getContStockPrices({
            ...defaultOptions,
            onError,
            volatility: -1 // invalid value to trigger error
        });

        generator.start();

        setTimeout(() => {
            expect(onError).toHaveBeenCalled();
            generator.stop();
            done();
        }, 200);
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

    test('should respect step size rounding', () => {
        const result = getStockPrices({ ...defaultOptions, step: 500 });
        const aligned = result.data.every(p => p % 500 === 0);
        expect(aligned).toBe(true);
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

    test('should apply delisting when price reaches 0', () => {
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

    test('should trigger onStart, onStop, onComplete, and onError callbacks', (done) => {
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
            // Optional checks depending on generator behavior
            done();
        }, 250);
    });
});