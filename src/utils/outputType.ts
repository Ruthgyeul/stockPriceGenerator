import type { DataType } from '../types';

export function outputType(price: number, dataType: DataType) {
    if (dataType === 'int') {
        return Math.round(price);
    } else {
        return Number(price.toFixed(2));
    }
}
