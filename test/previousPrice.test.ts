import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('previous price tracking', () => {
    const baseOptions: StockPriceOptions = {
        startPrice: 10000,
        volatility: 0.1,
        drift: 0.05,
        algorithm: 'RandomWalk',
        interval: 20,
        seed: 777
    };

    test('getStockPrices omits previousPrice when only one price was generated', () => {
        const result = getStockPrices({ ...baseOptions, length: 1 });
        expect(result.previousPrice).toBeUndefined();
    });

    test('getStockPrices returns the second-to-last price as previousPrice', () => {
        const result = getStockPrices({ ...baseOptions, length: 10 });
        expect(result.previousPrice).toBe(result.data[result.data.length - 2]);
    });

    test('getPreviousPrice() is null before the first tick', () => {
        const generator = getContStockPrices(baseOptions);
        expect(generator.getPreviousPrice()).toBeNull();
    });

    test('getPreviousPrice() reflects the price before the current one after ticking', (done) => {
        const generator = getContStockPrices(baseOptions);
        const startPrice = generator.getCurrentPrice();

        generator.start();

        setTimeout(() => {
            generator.stop();
            expect(generator.getPreviousPrice()).toBe(startPrice);
            expect(generator.getCurrentPrice()).not.toBe(startPrice);
            done();
        }, 30);
    });

    test('onPrice receives (price, previousPrice), null on the first tick and populated afterwards', (done) => {
        const calls: Array<[number, number | null]> = [];
        const generator = getContStockPrices({
            ...baseOptions,
            onPrice: (price, previousPrice) => calls.push([price, previousPrice])
        });
        const startPrice = generator.getCurrentPrice();

        generator.start();

        setTimeout(() => {
            generator.stop();
            expect(calls.length).toBeGreaterThanOrEqual(2);
            expect(calls[0][1]).toBe(startPrice);
            expect(calls[1][1]).toBe(calls[0][0]);
            done();
        }, 60);
    });
});
