export interface AlgorithmParams {
    currentPrice: number; // Current stock price
    volatility: number; // Volatility of the stock price
    drift: number; // Drift of the stock price
    seed?: number; // Seed for random number generation
}