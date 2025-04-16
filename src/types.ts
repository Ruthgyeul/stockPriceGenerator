import type { Algorithm } from './utils/algorithm/algorithms';

export type DataType = 'float' | 'int';

export interface StockPriceOptions {
  startPrice: number; // Initial stock price
  length?: number; // Length of the generated data
  volatility?: number; // Volatility of the stock price
  drift?: number; // Drift of the stock price
  seed?: number; // Seed for random number generation
  min?: number; // Minimum stock price
  max?: number; // Maximum stock price
  delisting?: boolean; // Keep stock price to 0 if it reaches 0
  step?: number; // Step size for the generated data
  dataType?: DataType; // Type of data to generate (float or int)
  algorithm?: Algorithm; // Algorithm to use for generating stock prices
  interval?: number; // Interval for generating stock prices (in milliseconds)
  onStart?: () => void; // Callback for when the generator starts
  onPrice?: (price: number, previousPrice: number | null) => void; // Callback for each generated price
  onStop?: () => void; // Callback for when the generator stops
  onComplete?: () => void; // Callback for when the generator completes
  onError?: (error: Error) => void; // Callback for errors
}

export interface StockPriceResult {
  data: number[]; // Array of generated stock prices
  price: number; // Current stock price
  previousPrice?: number; // Previous stock price (optional)
}

export interface StockPriceGenerator {
  start: () => void; // Start generating stock prices
  pause: () => void; // Pause generating stock prices
  continue: () => void; // Continue generating stock prices
  stop: () => void; // Stop generating stock prices
  getCurrentPrice: () => number; // Get the current stock price
  getPreviousPrice: () => number | null; // Get the previous stock price
}