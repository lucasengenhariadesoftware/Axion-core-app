
import { generateWeeklyPlan } from './src/lib/workout_logic';
import { UserProfile } from './src/types';

const mockProfile = (goal: 'lose_weight' | 'gain_muscle' | 'maintain', activity: 'sedentary' | 'moderately_active' | 'very_active'): UserProfile => ({
    name: 'Test User',
    gender: 'male',
    age: 30,
    height: 180,
    weight: 80,
    goal: goal,
    activityLevel: activity,
    dietaryRestrictions: []
});

console.log('--- TEST: Fat Loss (Beginner) ---');
const p1 = generateWeeklyPlan(mockProfile('lose_weight', 'sedentary'));
console.log(`Plan: ${p1.name}`);
console.log(`Sessions: ${p1.sessions.length}`);
p1.sessions.forEach(s => console.log(`  [${s.dayLabel}] ${s.title} (${s.exercises.length} ex)`));

console.log('\n--- TEST: Muscle Gain (Intermediate) ---');
const p2 = generateWeeklyPlan(mockProfile('gain_muscle', 'moderately_active'));
console.log(`Plan: ${p2.name}`);
console.log(`Sessions: ${p2.sessions.length}`);
p2.sessions.forEach(s => console.log(`  [${s.dayLabel}] ${s.title} (${s.exercises.length} ex)`));

console.log('\n--- TEST: Muscle Gain (Advanced) ---');
const p3 = generateWeeklyPlan(mockProfile('gain_muscle', 'very_active'));
console.log(`Plan: ${p3.name}`);
console.log(`Sessions: ${p3.sessions.length}`);
p3.sessions.forEach(s => console.log(`  [${s.dayLabel}] ${s.title} (${s.exercises.length} ex)`));
