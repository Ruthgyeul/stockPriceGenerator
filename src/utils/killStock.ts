export function killStock(price : number) {
    if (price <= 0) {
        return Number(0);
    } else {
        return Number(price);
    }
}