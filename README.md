# Stock Price Generator
Generates random number for synthetic stock price data using various random algorithm models. The generated data can be used for testing and simulation purposes.

## Features
- Generate one-time stock price arrays
- Create continuous stock price generators with configurable intervals
- Support for various random algorithms (Random Walk, GBM, etc.)
- Configurable parameters for volatility, drift, and more
- Support for both ES Modules (import/export), CommonJS (require), and TypeScript

## Installation

```bash
# Using npm
npm install stockprice-generator
```

## Usage
> Check github for more example usages
### CommonJS
```javascript
const { getStockPrices, getContStockPrices } = require('stockprice-generator');

// Generate an array of stock prices
const result = getContStockPrices({
    startPrice: 10000, // required
    length: 100,
    volatility: 0.1,
    drift: 0.05,
    min: 5000,
    max: 15000,
    dataType: 'int',
    algorithm: 'RandomWalk'
});

console.log(result.data); // Array of prices
console.log(result.price); // Current price (last price in the array)
```

### ES Modules
```javascript
import { getStockPrices, getContStockPrices } from 'stockprice-generator';

// Generate an array of stock prices
const result = getStockPrices({
    startPrice: 10000, // required
    length: 100,
    volatility: 0.1,
    drift: 0.05,
    min: 5000,
    max: 15000,
    dataType: 'int',
    algorithm: 'RandomWalk'
});

console.log(result.data); // Array of prices
console.log(result.price); // Current price (last price in the array)
```

### Continuous Generation (CommonJS)
```javascript
const { getContStockPrices } = require('stockprice-generator');

// Create a continuous generator that emits prices every 60 seconds
const generator = getContStockPrices({
    startPrice: 10000, // required
    volatility: 0.1,
    drift: 0.05,
    min: 5000,
    max: 15000,
    dataType: 'int',
    algorithm: 'RandomWalk',
    interval: 60000, // 60 seconds
    onPrice: (price, previousPrice) => {
        console.log(`New: ${price} | Previous: ${previousPrice}`);
    }
});

// Start the generator
generator.start();

// Get the current price
console.log(`Current price: ${generator.getCurrentPrice()}`);

// Stop the generator when done
// generator.stop();
```

### Continuous Generation (ES Modules)
```javascript
import { getStockPrices } from 'stockprice-generator';

// Create a continuous generator that emits prices every 60 seconds
const generator = getStockPrices({
    startPrice: 10000, // required
    volatility: 0.1,
    drift: 0.05,
    min: 5000,
    max: 15000,
    dataType: 'int',
    algorithm: 'RandomWalk',
    interval: 1000, // 1 seconds
    onPrice: (price, previousPrice) => {
        console.log(`New: ${price} | Previous: ${previousPrice}`);
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

| Parameter    | Type              | Default    | Description                                                       |
|--------------|-------------------|------------|-------------------------------------------------------------------|
| `startPrice` | number            | -          | [Required] Initial price of the stock                             |
| `length`     | number            | 100        | Length of the output array                                        |
| `volatility` | number            | 0.1        | Volatility of the stock price (standard deviation of the returns) |
| `drift`      | number            | 0.05       | The drift of the stock price (mean of the returns)                |
| `seed`       | number            | -          | Seed for random number generation (for reproducibility)           |
| `min`        | number            | -          | Minimum price for the stock (min > 0)                             |
| `max`        | number            | -          | Maximum price for the stock (max > 0)                             |
| `delisting`  | boolean           | false      | Keep stock price to 0, if it reaches to 0                         |
| `step`       | number            | -          | Step size for discretization                                      |
| `dataType`   | float \| int      | float      | Type of the output data type                                      |
| `algorithm`  | RandomWalk \| GBM | RandomWalk | Algorithm for generating the random number                        |

## Handler Functions (only for continuous generation)

| Parameter    | Type     | Default  | Description                                                             |
|--------------|----------|----------|-------------------------------------------------------------------------|
| `interval`   | number   | 60000    | Interval in milliseconds between price updates in continuous generation |
| `onStart`    | function | -        | Callback function to handle generator start event                       |
| `onPrice`    | function | -        | Callback function to handle new prices in continuous generation         |
| `onStop`     | function | -        | Callback function to handle generator stop event                        |
| `onComplete` | function | -        | Callback function to handle generator completion event                  |
| `onError`    | function | -        | Callback function to handle errors in continuous generation             |

# Example Output
```javascript
[1000, 1002.59, 1023.62, 1006.69, 1029.67, 1012.96]
```

# RandomWalk Output Graph
![RandomWalk](https://raw.githubusercontent.com/Ruthgyeul/stockPriceGenerator/main/examples/randomwalk.png)

## License
MIT