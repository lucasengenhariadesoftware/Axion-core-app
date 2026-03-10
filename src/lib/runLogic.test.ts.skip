import { calculateDistance, formatTime, formatPace } from './runLogic';

describe('Run Logic', () => {
    describe('calculateDistance', () => {
        it('should calculate distance roughly correct between two points', () => {
            const p1 = { lat: 0, lng: 0, timestamp: 0 };
            const p2 = { lat: 0, lng: 1, timestamp: 0 }; // 1 degree longitude at equator is ~111km
            const dist = calculateDistance(p1, p2);
            // 111.19 km approx
            expect(dist).toBeGreaterThan(111000);
            expect(dist).toBeLessThan(112000);
        });

        it('should be 0 for same point', () => {
            const p1 = { lat: 10, lng: 10, timestamp: 0 };
            expect(calculateDistance(p1, p1)).toBe(0);
        });
    });

    describe('formatTime', () => {
        it('should format seconds correctly', () => {
            expect(formatTime(65)).toBe('01:05');
            expect(formatTime(3665)).toBe('1:01:05');
            expect(formatTime(0)).toBe('00:00');
        });
    });

    describe('formatPace', () => {
        it('should format pace correctly', () => {
            expect(formatPace(5.5)).toBe("5'30''");
            expect(formatPace(0)).toBe("-'--''");
            expect(formatPace(Infinity)).toBe("-'--''");
        });
    });
});
