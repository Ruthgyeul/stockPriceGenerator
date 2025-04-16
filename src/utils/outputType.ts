export function outputType(price : number, dataType: string) {
    if (dataType === 'int') {
        return Number(price.toFixed(0));
    } else {
        return Number(price.toFixed(2));
    }
}
