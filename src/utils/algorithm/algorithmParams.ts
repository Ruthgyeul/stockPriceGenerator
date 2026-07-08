import type { DataType } from '../../types';

export interface AlgorithmParams {
    currentPrice: number; // Current stock price
    volatility: number; // Volatility of the stock price
    drift: number; // Drift of the stock price
    seed?: number; // Seed for random number generation
    min?: number; // Minimum stock price
    max?: number; // Maximum stock price
    delisting?: boolean; // Keep stock price to 0 if it reaches 0
    dataType?: DataType; // Type of data to generate (float or int)
    longTermMean?: number; // OU: level the price reverts toward (defaults to startPrice)
    reversionSpeed?: number; // OU: how fast the price pulls back toward longTermMean
    jumpIntensity?: number; // JumpDiffusion: expected number of jumps per year
    jumpMean?: number; // JumpDiffusion: mean log-size of a jump
    jumpVolatility?: number; // JumpDiffusion: volatility of the jump log-size
}