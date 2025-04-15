import { Algorithm } from './utils/algorithm/algorithms';

export type DataType = 'float' | 'int';

export interface StockPriceOptions {
  startPrice: number; // Initial stock price
  days?: number; // Number of days to generate prices for
  volatility?: number; // Volatility of the stock price
  drift?: number; // Drift of the stock price
  seed?: number; // Seed for random number generation
  data?: number[]; // Array of stock prices
  min?: number; // Minimum stock price
  max?: number; // Maximum stock price
  length?: number; // Length of the generated data
  step?: number; // Step size for the generated data
  type?: DataType; // Type of data to generate (float or int)
  algorithm?: Algorithm; // Algorithm to use for generating stock prices
  interval?: number; // Interval for generating stock prices (in milliseconds)
  onPrice?: (price: number) => void; // Callback for each generated price
  onError?: (error: Error) => void; // Callback for errors
  onStop?: () => void; // Callback for when the generator stops
  onStart?: () => void; // Callback for when the generator starts
  onComplete?: () => void; // Callback for when the generator completes
}

export interface StockPriceResult {
  data: number[]; // Array of generated stock prices
  price: number; // Current stock price
}

export interface StockPriceGenerator {
  start: () => void; // Start generating stock prices
  stop: () => void; // Stop generating stock prices
  getCurrentPrice: () => number; // Get the current stock price
}