// Continuous price models (GBM/RandomWalk) decay exponentially and can never land on
// exactly 0, so "delisting" is defined as dropping to or below a near-worthless
// threshold rather than requiring the literal value 0.
export function killStock(price: number, threshold = 0.01): number {
    return price <= threshold ? 0 : Number(price);
}
