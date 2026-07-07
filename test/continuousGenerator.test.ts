import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('Continuous generator - determinism and validation', () => {
    const baseOptions: StockPriceOptions = {
        startPrice: 10000,
        volatility: 0.1,
        drift: 0.05,
        algorithm: 'RandomWalk',
        interval: 20,
        seed: 777
    };

    test('two independent continuous generators with the same seed produce the same price sequence', (done) => {
        const pricesA: number[] = [];
        const pricesB: number[] = [];

        const generatorA = getContStockPrices({ ...baseOptions, onPrice: (p) => pricesA.push(p) });
        const generatorB = getContStockPrices({ ...baseOptions, onPrice: (p) => pricesB.push(p) });

        generatorA.start();
        generatorB.start();

        setTimeout(() => {
            generatorA.stop();
            generatorB.stop();

            expect(pricesA.length).toBeGreaterThan(0);
            expect(pricesA).toEqual(pricesB);
            done();
        }, 200);
    });

    test('getStockPrices throws synchronously for negative volatility', () => {
        expect(() => getStockPrices({ startPrice: 10000, length: 5, volatility: -1 })).toThrow(
            'Volatility must be a non-negative number'
        );
    });

    test('getContStockPrices reports the error via onError instead of throwing', (done) => {
        const onError = jest.fn();
        const generator = getContStockPrices({
            ...baseOptions,
            volatility: -1,
            onError
        });

        generator.start();

        setTimeout(() => {
            generator.stop();
            expect(onError).toHaveBeenCalledWith(expect.any(Error));
            done();
        }, 100);
    });

    test('pause() stops ticking and continue() resumes it', (done) => {
        const onPrice = jest.fn();
        const generator = getContStockPrices({ ...baseOptions, onPrice });

        generator.start();

        setTimeout(() => {
            generator.pause();
            const callsAfterPause = onPrice.mock.calls.length;
            expect(callsAfterPause).toBeGreaterThan(0);

            setTimeout(() => {
                // No ticks should have happened while paused
                expect(onPrice.mock.calls.length).toBe(callsAfterPause);

                generator.continue();
                setTimeout(() => {
                    generator.stop();
                    expect(onPrice.mock.calls.length).toBeGreaterThan(callsAfterPause);
                    done();
                }, 100);
            }, 100);
        }, 100);
    });

    test('continue() is a no-op while already running', () => {
        const generator = getContStockPrices(baseOptions);
        generator.start();
        expect(() => generator.continue()).not.toThrow();
        generator.stop();
    });
});
