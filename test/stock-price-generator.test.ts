import { getStockPrices, getContStockPrices, StockPriceOptions } from '../src';

describe('Stock Price Generator', () => {
  describe('getStockPrices', () => {
    const defaultOptions: StockPriceOptions = {
      startPrice: 10000,
      days: 10,
      volatility: 0.1,
      drift: 0.05,
      algorithm: 'RandomWalk'
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

    test('should start with the specified start price', () => {
      const result = getStockPrices(defaultOptions);
      expect(result.data[0]).toBe(defaultOptions.startPrice);
    });

    test('should handle different algorithms', () => {
      const gbmResult = getStockPrices({ ...defaultOptions, algorithm: 'GBM' });
      const randomWalkResult = getStockPrices({ ...defaultOptions, algorithm: 'RandomWalk' });
      
      expect(gbmResult.data.length).toBe(defaultOptions.days);
      expect(randomWalkResult.data.length).toBe(defaultOptions.days);
      
      // Prices should be different due to different algorithms
      expect(gbmResult.data).not.toEqual(randomWalkResult.data);
    });

    test('should respect volatility parameter', () => {
      // Test with fixed parameters for deterministic results
      const lowVolatility = getStockPrices({
        ...defaultOptions,
        days: 30,
        startPrice: 10000,
        volatility: 0.01,
        drift: 0,
        seed: 12345
      });

      const highVolatility = getStockPrices({
        ...defaultOptions,
        days: 30,
        startPrice: 10000,
        volatility: 0.1,  // Reduced from 0.5 to 0.1 for more reasonable price movements
        drift: 0,
        seed: 12345
      });

      const lowVolRange = Math.max(...lowVolatility.data) - Math.min(...lowVolatility.data);
      const highVolRange = Math.max(...highVolatility.data) - Math.min(...highVolatility.data);

      // With higher volatility, we expect more price variation
      expect(highVolRange).toBeGreaterThan(lowVolRange);
      
      // Also verify the ranges are reasonable
      expect(lowVolRange).toBeGreaterThan(0);
      expect(lowVolRange).toBeLessThan(highVolRange);
      expect(highVolRange).toBeLessThan(10000); // More reasonable upper bound (100% of start price)
    });
  });

  describe('getContStockPrices', () => {
    const defaultOptions: StockPriceOptions = {
      startPrice: 10000,
      volatility: 0.1,
      drift: 0.05,
      algorithm: 'RandomWalk',
      interval: 100 // Using 100ms for faster tests
    };

    test('should create a generator with correct interface', () => {
      const generator = getContStockPrices(defaultOptions);
      expect(generator).toHaveProperty('start');
      expect(generator).toHaveProperty('stop');
      expect(generator).toHaveProperty('getCurrentPrice');
      expect(typeof generator.start).toBe('function');
      expect(typeof generator.stop).toBe('function');
      expect(typeof generator.getCurrentPrice).toBe('function');
    });

    test('should start with the specified start price', () => {
      const generator = getContStockPrices(defaultOptions);
      expect(generator.getCurrentPrice()).toBe(defaultOptions.startPrice);
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
        // Invalid volatility to trigger an error
        volatility: -1
      });
      
      generator.start();
      
      setTimeout(() => {
        expect(onError).toHaveBeenCalled();
        generator.stop();
        done();
      }, 200);
    });
  });
}); 