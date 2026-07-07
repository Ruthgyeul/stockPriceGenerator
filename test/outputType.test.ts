import { outputType } from '../src/utils/outputType';

describe('outputType', () => {
    test('rounds to the nearest integer when dataType is "int"', () => {
        expect(outputType(10.4, 'int')).toBe(10);
        expect(outputType(10.5, 'int')).toBe(11);
        expect(Number.isInteger(outputType(10.4, 'int'))).toBe(true);
    });

    test('rounds to 2 decimal places when dataType is "float"', () => {
        expect(outputType(10.12345, 'float')).toBe(10.12);
        expect(outputType(10, 'float')).toBe(10);
    });

    test('always returns a number', () => {
        expect(typeof outputType(10.12345, 'float')).toBe('number');
        expect(typeof outputType(10.6, 'int')).toBe('number');
    });
});
