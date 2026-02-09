
import { generateWeeklyPlan } from './src/lib/workout_logic';
import { UserProfile } from './src/types';
import { EXERCISE_LIBRARY } from './src/data/exercises';

const femaleProfile: UserProfile = {
    name: 'Test Female',
    gender: 'female',
    age: 30,
    height: 165,
    weight: 60,
    goal: 'gain_muscle',
    activityLevel: 'moderately_active',
    trainingLevel: 'intermediate',
    dietaryRestrictions: [],
    workoutMode: 'home',
    homeEquipment: ['bodyweight_only', 'resistance_band', 'swiss_ball', 'step_platform']
};

console.log("Generating plan for Female profile...");
const plan = generateWeeklyPlan(femaleProfile);

let femaleFocusedCount = 0;
let totalExercises = 0;

console.log("\n--- Weekly Plan Analysis ---");
plan.sessions.forEach(session => {
    console.log(`\nSession: ${session.title} (${session.dayLabel})`);
    session.exercises.forEach(ex => {
        const libEx = EXERCISE_LIBRARY[ex.exerciseId];
        const isFeminino = libEx?.tags?.includes('#feminino');
        const prefix = isFeminino ? '[FEM]' : '[   ]';
        console.log(`${prefix} ${ex.exerciseName} (${ex.sets.length} sets)`);

        totalExercises++;
        if (isFeminino) femaleFocusedCount++;
    });
});

console.log(`\nTotal Exercises: ${totalExercises}`);
console.log(`Female Focused: ${femaleFocusedCount} (${Math.round(femaleFocusedCount / totalExercises * 100)}%)`);

if (femaleFocusedCount > 0) {
    console.log("SUCCESS: Female focused exercises were prioritized.");
} else {
    console.log("FAILURE: No female focused exercises found.");
}
