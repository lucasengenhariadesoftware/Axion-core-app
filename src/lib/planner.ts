import { UserProfile, DailyPlan, DietPreferences } from '../types';
import { buildDailyPlan } from './mealBuilder';

// Re-using the types from types/index.ts to avoid duplication / conflicts
export { type DailyPlan } from '../types';

export const generateDailyPlan = (profile: UserProfile): DailyPlan => {
    // Calorie Calculation (Mifflin-St Jeor Equation)
    let tmb = 0;
    if (profile.gender === 'male') {
        tmb = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
    } else {
        tmb = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
    }

    // Activity Multiplier
    const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725
    };

    const estimatedTDEE = tmb * (activityMultipliers[profile.activityLevel] || 1.2);

    // Goal Adjustment
    let targetCalories = estimatedTDEE;
    if (profile.goal === 'lose_weight') targetCalories -= 500;
    if (profile.goal === 'gain_muscle') targetCalories += 300;

    targetCalories = Math.round(targetCalories);

    // Water Target (35ml per kg)
    const waterTarget = Math.round(profile.weight * 35);

    const isMuscle = profile?.goal === 'gain_muscle';

    // Build Diet Preferences from Profile
    const dietPrefs: DietPreferences = {
        goal: profile.goal as any,
        dietType: 'omnivore', // Default, should be in profile ideally
        cookingTime: 'moderate',
        mealsPerDay: 4,
        allergies: profile.dietaryRestrictions || [],
        isSimpleMode: false,
        budget: 'standard',
        gender: profile.gender
    };

    const generatedMeals = buildDailyPlan(dietPrefs);

    return {
        date: new Date().toISOString().split('T')[0],
        meta: {
            totalCalories: targetCalories,
            protein: Math.round(targetCalories * 0.25 / 4), // Rough estimate
            waterTarget: waterTarget,
            focus: isMuscle ? 'Hipertrofia' : 'Perda de Peso'
        },
        workout: {
            id: 'w-1',
            title: isMuscle ? 'Treino A - Superior (Hipertrofia)' : 'Treino Full Body (Metabólico)',
            dayLabel: 'Treino do Dia',
            focus: isMuscle ? 'Chest & Triceps' : 'Full Body',
            warmup: ['Aquecimento Geral 5min'],
            cooldown: ['Alongamento 5min'],
            estimatedDuration: isMuscle ? 60 : 45,
            duration: isMuscle ? 60 : 45,
            exercises: [], // Mock empty exercises for now to satisfy type
            completed: false
        },
        meals: generatedMeals
    };
};
