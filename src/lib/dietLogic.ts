import { DietPreferences, Meal, DailyPlan, MealItem } from '../types/diet';
import { buildDailyPlan, getSmartSubstitutionsBuilder, generateMealFromTemplate } from './mealBuilder';
import { FOOD_DATABASE } from './foodDatabase';

// Re-exporting legacy calculateWaterTarget if needed
export const calculateWaterTarget = (weight: number): number => {
    return weight * 35; // 35ml per kg
};

export const generateDailyPlan = (prefs: DietPreferences): DailyPlan => {
    const meals = buildDailyPlan(prefs);

    // Calculate total macros for the day (optional metadata)
    const totalProtein = meals.reduce((acc, meal) => acc + meal.items.reduce((s, i) => s + (i.macros?.protein || 0), 0), 0);

    return {
        date: new Date().toISOString().split('T')[0],
        meals: meals,
        meta: {
            waterTarget: calculateWaterTarget(70), // TODO: Get actual user weight
            focus: prefs.goal === 'lose_weight' ? 'Definição' : 'Energia',
            protein: totalProtein
        }
    };
};

// Adapter for the MealCard swap function
export const getSmartSubstitutions = (item: MealItem, criteria: 'protein' | 'cheaper' | 'faster' = 'protein'): MealItem[] => {
    return getSmartSubstitutionsBuilder(item, criteria);
};

// Adapter for Fridge Mode using new DB
export const generateFridgeMeal = (pantryIds: string[], mealType: string): MealItem[] => {
    const allFoods = Object.values(FOOD_DATABASE).flat();
    const available = allFoods.filter(f => pantryIds.includes(f.id));

    // Simple logic: Try to find Protein + Carb
    const proteins = available.filter(f => f.category === 'protein');
    const carbs = available.filter(f => f.category === 'carb');

    const selected: MealItem[] = [];
    if (proteins.length > 0) selected.push(proteins[0]);
    if (carbs.length > 0) selected.push(carbs[0]);

    // If we have both, maybe add a veg?
    if (selected.length === 2) {
        const vegs = available.filter(f => f.category === 'veg');
        if (vegs.length > 0) selected.push(vegs[0]);
    }

    return selected;
};
