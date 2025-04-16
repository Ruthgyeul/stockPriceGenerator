export type DataType = 'float' | 'int';

export interface AlgorithmParams {
    currentPrice: number; // Current stock price
    volatility: number; // Volatility of the stock price
    drift: number; // Drift of the stock price
    seed?: number; // Seed for random number generation
    dataType?: DataType; // Type of data to generate (float or int)
}