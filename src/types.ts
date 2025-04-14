import { Algorithm } from './utils/algorithm/algorithms';

export type DataType = 'float' | 'int';

export interface StockPriceOptions {
  startPrice: number;
  days?: number;
  volatility?: number;
  drift?: number;
  seed?: number;
  data?: number[];
  min?: number;
  max?: number;
  length?: number;
  step?: number;
  type?: DataType;
  algorithm?: Algorithm;
  interval?: number;
  onPrice?: (price: number) => void;
  onError?: (error: Error) => void;
  onStop?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
}

export interface StockPriceResult {
  data: number[];
  price: number;
}

export interface StockPriceGenerator {
  start: () => void;
  stop: () => void;
  getCurrentPrice: () => number;
} 