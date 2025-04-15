export function seededRandom(seed?: number): number {
  if (seed === undefined) {
    return Math.random();
  }

  // 64-bit SplitMix64 algorithm
  let state = BigInt(seed);
  state += 0x9E3779B97F4A7C15n;
  let z = state;
  z = (z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n;
  z = (z ^ (z >> 27n)) * 0x94D049BB133111EBn;
  z = z ^ (z >> 31n);

  return Number(z & 0xFFFFFFFFFFFFFFFFn) / Number(0xFFFFFFFFFFFFFFFFn);
}