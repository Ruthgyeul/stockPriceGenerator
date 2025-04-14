interface AlgorithmOptions {
  currentPrice: number;
  volatility: number;
  drift: number;
  seed?: number;
}

function seededRandom(seed?: number): number {
  if (seed === undefined) {
    return Math.random();
  }
  
  // Mulberry32 algorithm - a fast 32-bit seeded random number generator
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

export function randomWalk({ currentPrice, volatility, drift, seed }: AlgorithmOptions): number {
  const random = seededRandom(seed);
  // Scale down the change to be a percentage of volatility
  const change = (random - 0.5) * volatility * 0.1; // Reduce the impact of volatility
  const driftEffect = drift * (1/365); // Daily drift
  return currentPrice * (1 + change + driftEffect);
}

export function gbm({ currentPrice, volatility, drift, seed }: AlgorithmOptions): number {
  const dt = 1/365; // daily time step
  const random = seededRandom(seed);
  const change = Math.exp(
    (drift - 0.5 * volatility * volatility) * dt +
    volatility * Math.sqrt(dt) * (random * 2 - 1)
  );
  return currentPrice * change;
}

export const algorithms = {
  RandomWalk: randomWalk,
  GBM: gbm
} as const;

export type Algorithm = keyof typeof algorithms; 