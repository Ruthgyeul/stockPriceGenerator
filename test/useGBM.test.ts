import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('GBM Algorithm - Stock Price Generator', () => {
    const defaultOptions: StockPriceOptions = {
        startPrice: 10000,
        days: 10,
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

    test('should generate correct number of days', () => {
        const result = getStockPrices(defaultOptions);
        expect(result.data.length).toBe(defaultOptions.days);
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
});