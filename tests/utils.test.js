import { firstGroupString, secondGroupString, thirtGroupString } from "../src/globalConsts"
import { calculateLongestSequence, getRateGroupString } from "../src/utils";

describe('getRateGroupString should return correct string group', () => {
    it('expect firstGroupString', () => {
        expect(getRateGroupString(0.5)).toBe(firstGroupString);
    });
    
    it('expect secondGroupString', () => {
        expect(getRateGroupString(1)).toBe(secondGroupString);
    });
    
    it('expect thirtGroupString', () => {
        expect(getRateGroupString(1.5)).toBe(thirtGroupString);
    });
});

describe('calculateLongestSequence should return correct calculation', () => {
    it('should return 1 when no condition is fullfilled', () => {
        const input = [1.478853, 2.01953, 2.856672, 3.956731, 4.011168, 5.989457, 8.673006, 88.999674];

        expect(calculateLongestSequence(input)).toEqual(1);
    });

    it('should correct when longest collection is second in row', () => {
        const input = [0.478853, 0.856672, 0.81953, 3.956731, 4.011168, 4.289457, 4.273006, 88.999674];

        expect(calculateLongestSequence(input)).toEqual(4);
    });
});