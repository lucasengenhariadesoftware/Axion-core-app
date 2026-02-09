
import { buildDailyPlan } from './src/lib/mealBuilder';
import { DietPreferences } from './src/types/diet';

const femalePrefs: DietPreferences = {
    goal: 'definition',
    dietType: 'omnivore',
    cookingTime: 'moderate',
    mealsPerDay: 4,
    allergies: [],
    isSimpleMode: false,
    budget: 'standard',
    gender: 'female'
};

const malePrefs: DietPreferences = {
    ...femalePrefs,
    gender: 'male',
    goal: 'gain_muscle'
};

console.log("--- Female Plan Analysis ---");
const femalePlan = buildDailyPlan(femalePrefs);
let femaleSpecialFoods = 0;

femalePlan.forEach(meal => {
    console.log(`\nMeal: ${meal.name} (${meal.type})`);
    meal.items?.forEach(item => {
        const iron = item.tags.includes('rich_iron') ? '[IRON]' : '';
        const calc = item.tags.includes('rich_calcium') ? '[CALC]' : '';
        console.log(`- ${item.name} ${iron} ${calc}`);
        if (iron || calc) femaleSpecialFoods++;
    });
});

console.log(`\nSpecial Foods Found: ${femaleSpecialFoods}`);

if (femaleSpecialFoods > 0) {
    console.log("SUCCESS: Female nutrients found in the plan.");
} else {
    // Note: It might be 0 if random selection didn't pick them, but with priority it should be likely
    console.log("WARNING: No specific nutrient tags found (could be random chance or logic issue).");
}
