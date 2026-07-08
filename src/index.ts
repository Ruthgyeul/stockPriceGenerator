import type { StockPriceOptions, StockPriceResult, StockPriceGenerator, DataType } from './types';
import { algorithms } from './utils/algorithm/algorithms';
import type { Algorithm as AlgorithmType } from './utils/algorithm/algorithms';
import { minMaxCheck } from './utils/minMaxCheck';
import { killStock } from './utils/killStock';

interface NextPriceParams {
  currentPrice: number;
  volatility: number;
  drift: number;
  algorithm: AlgorithmType;
  seed?: number;
  min: number;
  max: number;
  delisting: boolean;
  dataType: DataType;
  step?: number;
}

// Single source of truth for "what's the next price" used by both the one-shot
// array generator and the continuous generator, so the two APIs can't drift apart.
function computeNextPrice(params: NextPriceParams): number {
  const { currentPrice, volatility, drift, algorithm, seed, min, max, delisting, dataType, step } = params;

  if (volatility < 0) {
    throw new Error('Volatility must be a non-negative number');
  }

  const selectedAlgorithm = algorithms[algorithm];
  let nextPrice = selectedAlgorithm({ currentPrice, volatility, drift, seed, min, max, delisting, dataType });

  // Apply step size discretization if specified
  if (step && step > 0) {
    nextPrice = Math.round(nextPrice / step) * step;
  }

  return nextPrice;
}

class StockPriceGeneratorImpl implements StockPriceGenerator {
  private currentPrice: number; // Current stock price
  private previousPrice: number | null; // Price before the current one
  private readonly interval: number; // Interval in milliseconds
  private timer: ReturnType<typeof setInterval> | null; // Timer ID
  private readonly options: StockPriceOptions; // Options for the generator
  private tick: number; // Number of prices generated so far, used to advance the seed

  constructor(options: StockPriceOptions) {
    this.options = {
      volatility: 0.1,
      drift: 0.05,
      algorithm: 'RandomWalk',
      interval: 60000,
      ...options
    };

    const { min = 0, max = 0, delisting = false } = this.options;
    this.currentPrice = delisting
      ? killStock(this.options.startPrice)
      : minMaxCheck(min, max, this.options.startPrice);
    this.previousPrice = null;
    this.interval = this.options.interval || 60000;
    this.timer = null;
    this.tick = 0;
  }

  generateNextPrice(): number {
    const {
      volatility = 0.1,
      drift = 0.05,
      algorithm = 'RandomWalk',
      seed,
      step,
      min = 0,
      max = 0,
      delisting = false,
      dataType = 'float'
    } = this.options;

    // Advance the seed every tick; otherwise a fixed seed would make every
    // continuous tick resolve to the exact same "random" draw forever.
    this.tick += 1;

    return computeNextPrice({
      currentPrice: this.currentPrice,
      volatility,
      drift,
      algorithm: algorithm as AlgorithmType,
      seed: seed !== undefined ? seed + this.tick : undefined,
      min,
      max,
      delisting,
      dataType,
      step
    });
  }

  private runTimer(): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      try {
        const nextPrice = this.generateNextPrice();
        this.previousPrice = this.currentPrice;
        this.currentPrice = nextPrice;
        this.options.onPrice?.(this.currentPrice, this.previousPrice);
      } catch (error) {
        this.options.onError?.(error as Error);
      }
    }, this.interval);
  }

  start(): void {
    if (this.timer) return;
    this.options.onStart?.();
    this.runTimer();
  }

  pause(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  continue(): void {
    this.runTimer();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.options.onStop?.();
      this.options.onComplete?.();
    }
  }

  getCurrentPrice(): number {
    return this.currentPrice;
  }

  getPreviousPrice(): number | null {
    return this.previousPrice;
  }
}

export function getStockPrices(options: StockPriceOptions): StockPriceResult {
  const {
    startPrice,
    length = 100,
    volatility = 0.1,
    drift = 0.05,
    algorithm = 'RandomWalk',
    seed,
    min = 0,
    max = 0,
    delisting = false,
    dataType = 'float',
    step
  } = options;

  let currentPrice = delisting ? killStock(startPrice) : minMaxCheck(min, max, startPrice);
  const data: number[] = [currentPrice];

  for (let i = 1; i < length; i++) {
    currentPrice = computeNextPrice({
      currentPrice,
      volatility,
      drift,
      algorithm: algorithm as AlgorithmType,
      seed: seed !== undefined ? seed + i : undefined,
      min,
      max,
      delisting,
      dataType,
      step
    });
    data.push(currentPrice);
  }

  return {
    data,
    price: currentPrice,
    previousPrice: data.length > 1 ? data[data.length - 2] : undefined
  };
}

export function getContStockPrices(options: StockPriceOptions): StockPriceGenerator {
  return new StockPriceGeneratorImpl(options);
}

export * from './types';
