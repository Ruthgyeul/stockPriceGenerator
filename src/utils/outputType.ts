export function outputType(price : number, dataType: string) {
    if (dataType === 'int') {
        return Math.round(price);
    } else {
        return Number(price.toFixed(2));
    }
}
