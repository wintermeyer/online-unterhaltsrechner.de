import { getExpectedGroup } from '../utils/income';

describe('getExpectedGroup', () => {
    test('should return correct income group for various values', () => {
        expect(getExpectedGroup(2000)).toBe('0 bis 2.100 €');
        expect(getExpectedGroup(2300)).toBe('2.101 - 2.500 €');
        expect(getExpectedGroup(3500)).toBe('3.301 - 3.700 €');
        expect(getExpectedGroup(5000)).toBe('4.901 - 5.300 €');
        expect(getExpectedGroup(12000)).toBe('Über 11.200 €');
    });

    test('should handle edge cases', () => {
        expect(getExpectedGroup(0)).toBe('0 bis 2.100 €');
        expect(getExpectedGroup(-1)).toBe('0 bis 2.100 €');
        expect(getExpectedGroup(2100)).toBe('0 bis 2.100 €');
        expect(getExpectedGroup(2101)).toBe('2.101 - 2.500 €');
    });
}); 