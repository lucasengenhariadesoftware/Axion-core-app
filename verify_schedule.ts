
import { generateWeeklyPlan } from './src/lib/workout_logic';
import { UserProfile } from './src/types';

const mockProfile = (level: 'moderately_active' | 'very_active'): UserProfile => ({
    name: 'Test User',
    gender: 'male',
    age: 30,
    height: 180,
    weight: 80,
    goal: 'gain_muscle',
    activityLevel: level,
    dietaryRestrictions: []
});

console.log('--- Testing Moderately Active (Intermediate) ---');
const intermediatePlan = generateWeeklyPlan(mockProfile('moderately_active'));
console.log(`Plan Name: ${intermediatePlan.name}`);
console.log(`Sessions Count: ${intermediatePlan.sessions.length}`);
intermediatePlan.sessions.forEach(s => console.log(`- ${s.dayLabel}: ${s.title}`));

console.log('\n--- Testing Very Active (Advanced) ---');
const advancedPlan = generateWeeklyPlan(mockProfile('very_active'));
console.log(`Plan Name: ${advancedPlan.name}`);
console.log(`Sessions Count: ${advancedPlan.sessions.length}`);
advancedPlan.sessions.forEach(s => console.log(`- ${s.dayLabel}: ${s.title}`));
