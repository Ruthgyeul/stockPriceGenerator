# Stock Price Generator
Generates random number for synthetic stock price data using various random algorithm models. The generated data can be used for testing and simulation purposes.

## Features
- Generate one-time stock price arrays
- Create continuous stock price generators with configurable intervals
- Support for various random algorithms (Random Walk, GBM, etc.)
- Configurable parameters for volatility, drift, and more
- Track both the current and previous price via `getPreviousPrice()` / `result.previousPrice` / the `onPrice` callback
- Support for both ES Modules (import/export), CommonJS (require), and TypeScript

## Requirements
- Node.js 22.x or 24.x (active/maintenance LTS releases)

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
    startPrice: 10000,
    length: 100,
    volatility: 0.1,
    drift: 0.05,
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
    startPrice: 10000,
    length: 100,
    volatility: 0.1,
    drift: 0.05,
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
    startPrice: 10000,
    volatility: 0.1,
    drift: 0.05,
    algorithm: 'RandomWalk',
    interval: 60000, // 60 seconds
    onPrice: (price, previousPrice) => {
        console.log(`New price: ${price} (was ${previousPrice})`);
    }
});

// Start the generator
generator.start();

// Get the current and previous price
console.log(`Current price: ${generator.getCurrentPrice()}`);
console.log(`Previous price: ${generator.getPreviousPrice()}`);

// Stop the generator when done
// generator.stop();
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
    onPrice: (price: number, previousPrice: number | null) => {
        console.log(`New price: ${price} (was ${previousPrice})`);
    }
});

// Start the generator
generator.start();

// Get the current and previous price
console.log(`Current price: ${generator.getCurrentPrice()}`);
console.log(`Previous price: ${generator.getPreviousPrice()}`);

// Stop the generator when done
// generator.stop();
```

## Examples

### Bounded price walk (min/max)
```javascript
import { getStockPrices } from 'stockprice-generator';

// Price is kept within [9000, 11000] for the whole series
const result = getStockPrices({
    startPrice: 10000,
    length: 100,
    min: 9000,
    max: 11000
});
```

### GBM with delisting
```javascript
import { getStockPrices } from 'stockprice-generator';

// If the price collapses to a near-zero threshold, it is forced to (and stays at) 0
const result = getStockPrices({
    startPrice: 100,
    length: 250,
    algorithm: 'GBM',
    drift: -2,
    volatility: 1.5,
    delisting: true
});
```

### Reproducible series with a seed
```javascript
import { getStockPrices } from 'stockprice-generator';

// Same seed always produces the same series
const a = getStockPrices({ startPrice: 10000, length: 50, seed: 42 });
const b = getStockPrices({ startPrice: 10000, length: 50, seed: 42 });
// a.data and b.data are identical
```

### Mean-reverting series (OU)
```javascript
import { getStockPrices } from 'stockprice-generator';

// The price drifts back toward longTermMean instead of wandering freely
const result = getStockPrices({
    startPrice: 10000,
    length: 250,
    algorithm: 'OU',
    longTermMean: 9500,
    reversionSpeed: 0.5,
    volatility: 0.2
});
```

### Jump-diffusion series (sudden spikes/crashes)
```javascript
import { getStockPrices } from 'stockprice-generator';

// Standard GBM diffusion plus occasional jumps
const result = getStockPrices({
    startPrice: 10000,
    length: 250,
    algorithm: 'JumpDiffusion',
    jumpIntensity: 5,
    jumpMean: 0,
    jumpVolatility: 0.3
});
```

### Discretized integer prices (step + dataType)
```javascript
import { getStockPrices } from 'stockprice-generator';

// Prices are rounded to the nearest multiple of 50 and returned as integers
const result = getStockPrices({
    startPrice: 10000,
    length: 100,
    step: 50,
    dataType: 'int'
});
```

## Parameters

| Parameter    | Required | Type            | Default | Description                                                       |
|--------------|----------|-----------------|--------|-------------------------------------------------------------------|
| `startPrice` | Yes      | number          | -      | Initial price of the stock                                        |
| `length`     | No       | number          | 100    | Length of the output array                                        |
| `volatility` | No       | number          | 0.1    | Volatility of the stock price (standard deviation of the returns) |
| `drift`      | No       | number          | 0.05   | The drift of the stock price (mean of the returns)                |
| `seed`       | No       | number          | DateTime | Seed for random number generation (for reproducibility)           |
| `min`        | No       | number          | 0      | Minimum price for the stock (0 = unlimited)                       |
| `max`        | No       | number          | 0      | Maximum price for the stock (0 = unlimited)                       |
| `delisting`  | No       |boolean|false| Force the price to 0 once it falls to or below a near-zero threshold |
| `step`       | No       | number          | -      | Step size for discretization                                      |
| `dataType`   | No       | float \| int    | float  | Type of the output data type                                      |
| `algorithm`  | No       | RandomWalk \| GBM \| OU \| JumpDiffusion | RandomWalk  | Algorithm for generating the random number                |
| `longTermMean` | No     | number          | `startPrice` | `OU` only: the level the price reverts toward                |
| `reversionSpeed` | No   | number          | 0.15   | `OU` only: how strongly the price is pulled back toward `longTermMean` |
| `jumpIntensity` | No    | number          | 1      | `JumpDiffusion` only: expected number of jumps per year               |
| `jumpMean`   | No       | number          | 0      | `JumpDiffusion` only: mean log-size of a jump                     |
| `jumpVolatility` | No   | number          | 0.1    | `JumpDiffusion` only: volatility of the jump log-size             |

> `min` and `max` only take effect when at least one of them is non-zero; leaving both at the default `0` means no bounds are enforced.

## Algorithms
- **RandomWalk**: simple random walk with drift and volatility
- **GBM**: Geometric Brownian Motion, the standard continuous-time model for stock prices
- **OU**: Ornstein-Uhlenbeck, a mean-reverting model that pulls the price back toward `longTermMean`
- **JumpDiffusion**: Merton jump-diffusion — GBM plus occasional Poisson-driven jumps for spikes/crashes

## Handler Functions (only for continuous generation)

| Parameter | Required | Type | Default  | Description                                                              |
|-----------|----------|------|----------|--------------------------------------------------------------------------|
| `interval` | Yes      | number | 60000    | Interval in milliseconds between price updates in continuous generation  |
| `onStart` | No       | function | -        | Callback function to handle generator start event                        |
| `onPrice` | No       | `(price: number, previousPrice: number \| null) => void` | -        | Callback function to handle new prices in continuous generation. `previousPrice` is `null` on the very first tick |
| `onStop` | No       | function | -        | Callback function to handle generator stop event                         |
| `onComplete` | No       | function | -        | Callback function to handle generator completion event                   |
| `onError` | No       | function | -        | Callback function to handle errors in continuous generation              |

## Security
This project has no runtime dependencies, and development dependencies are kept up to date and regularly audited with `npm audit`. If you discover a security issue, please open an issue on GitHub.

## License
MIT