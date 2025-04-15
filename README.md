# Stock Price Generator
Generates synthetic stock price data using various random algorithm models. The generated data can be used for testing and simulation purposes.

## Features
- Generate one-time stock price arrays
- Create continuous stock price generators with configurable intervals
- Support for various random algorithms (Random Walk)
- Configurable parameters for volatility, drift, and more
- Support for both ES Modules (import/export) and CommonJS (require)

## Installation

```bash
# Using npm
npm install stockprice-generator
```

## Usage

### ES Modules
```javascript
import { getStockPrices, getContStockPrices } from 'stockprice-generator';

// Generate an array of stock prices
const result = getStockPrices({
    startPrice: 10000,
    days: 30,
    volatility: 0.1,
    drift: 0.05,
    algorithm: 'RandomWalk'
});

console.log(result.data); // Array of prices
console.log(result.price); // Current price (last price in the array)
```

### CommonJS
```javascript
const { getStockPrices, getContStockPrices } = require('stockprice-generator');

// Generate an array of stock prices
const result = getContStockPrices({
    startPrice: 10000,
    days: 30,
    volatility: 0.1,
    drift: 0.05,
    algorithm: 'RandomWalk'
});

console.log(result.data); // Array of prices
console.log(result.price); // Current price (last price in the array)
```

### Continuous Generation (ES Modules)
```javascript
import { getStockPrices } from 'stockprice-generator';

// Create a continuous generator that emits prices every 60 seconds
const generator = getStockPrices({
    startPrice: 10000,
    volatility: 0.1,
    drift: 0.05,
    algorithm: 'RandomWalk',
    interval: 60000, // 60 seconds
    onPrice: (price: number) => {
        console.log(`New price: ${price}`);
    }
});

// Start the generator
generator.start();

// Get the current price
console.log(`Current price: ${generator.getCurrentPrice()}`);

// Stop the generator when done
// generator.stop();
```

### Continuous Generation (CommonJS)
```javascript
const { getContStockPrices } = require('stockprice-generator');

// Create a continuous generator that emits prices every 60 seconds
const generator = getContStockPrices({
    startPrice: 100,
    volatility: 0.1,
    drift: 0.05,
    algorithm: 'RandomWalk',
    interval: 60000, // 60 seconds
    onPrice: (price) => {
        console.log(`New price: ${price}`);
    }
});

// Start the generator
generator.start();

// Get the current price
console.log(`Current price: ${generator.getCurrentPrice()}`);

// Stop the generator when done
// generator.stop();
```

## Parameters

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `startPrice` | Yes | number | - | Initial price of the stock |
| `days` | No | number | 100 | Number of days to generate prices for |
| `volatility` | No | number | 0.1 | Volatility of the stock price (standard deviation of the returns) |
| `drift` | No | number | 0.05 | The drift of the stock price (mean of the returns) |
| `seed` | No | number | 12345 | Seed for random number generation (for reproducibility) |
| `data` | No | number[] | [] | Pre-existing array of stock prices |
| `min` | No | number | 0 | Minimum price for the stock |
| `max` | No | number | 10000 | Maximum price for the stock |
| `length` | No | number | - | Length of the output array |
| `step` | No | number | - | Step size for discretization |
| `type` | No | 'float' \| 'int' | 'float' | Type of the data |
| `algorithm` | No | 'GBM' \| 'RandomWalk' | 'GBM' | Algorithm for generating the data |
| `interval` | No | number | 60000 | For continuous generation, interval in milliseconds between price updates |
| `onPrice` | No | function | - | Callback function to handle new prices in continuous generation |
| `onError` | No | function | - | Callback function to handle errors in continuous generation |
| `onStop` | No | function | - | Callback function to handle generator stop event |
| `onStart` | No | function | - | Callback function to handle generator start event |
| `onComplete` | No | function | - | Callback function to handle generator completion event |

## License
MIT