import { StockPriceOptions, StockPriceResult, StockPriceGenerator } from './types';
import { algorithms, Algorithm as AlgorithmType } from './utils/algorithm/algorithms';

class StockPriceGeneratorImpl implements StockPriceGenerator {
  private currentPrice: number; // Current stock price
  private readonly interval: number; // Interval in milliseconds
  private timer: ReturnType<typeof setInterval> | null; // Timer ID
  private readonly options: StockPriceOptions; // Options for the generator

  constructor(options: StockPriceOptions) {
    this.options = {
      volatility: 0.1,
      drift: 0.05,
      algorithm: 'RandomWalk',
      interval: 60000,
      ...options
    };
    this.currentPrice = options.startPrice;
    this.interval = this.options.interval || 60000;
    this.timer = null;
  }

  generateNextPrice(): number {
    const { volatility = 0.1, drift = 0.05, algorithm = 'RandomWalk', seed } = this.options;
    
    if (volatility < 0) {
      throw new Error('Volatility must be a non-negative number');
    }

    const selectedAlgorithm = algorithms[algorithm as AlgorithmType];
    return selectedAlgorithm({
      currentPrice: this.currentPrice,
      volatility,
      drift,
      seed
    });
  }

  start(): void {
    if (this.timer) return;
    
    this.options.onStart?.();
    
    this.timer = setInterval(() => {
      try {
        this.currentPrice = this.generateNextPrice();
        this.options.onPrice?.(this.currentPrice);
      } catch (error) {
        this.options.onError?.(error as Error);
      }
    }, this.interval);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.options.onStop?.();
    }
  }

  getCurrentPrice(): number {
    return this.currentPrice;
  }
}

export function getStockPrices(options: StockPriceOptions): StockPriceResult {
  const { startPrice, days = 100, algorithm = 'RandomWalk' } = options;
  const data: number[] = [startPrice];
  let currentPrice = startPrice;

  for (let i = 1; i < days; i++) {
    const generator = new StockPriceGeneratorImpl({
      ...options,
      startPrice: currentPrice
    });
    currentPrice = generator.generateNextPrice();
    data.push(currentPrice);
  }

  return {
    data,
    price: currentPrice
  };
}

export function getContStockPrices(options: StockPriceOptions): StockPriceGenerator {
  return new StockPriceGeneratorImpl(options);
}

export * from './types'; 