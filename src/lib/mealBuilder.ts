import { Meal, MealItem, MealTemplate, DietPreferences, Goal, Gender } from '../types/diet';
import { FOOD_DATABASE } from './foodDatabase';

// --- TEMPLATES ---

const MEAL_TEMPLATES: MealTemplate[] = [
    {
        id: 't_plate_traditional',
        name: 'Prato Feito',
        type: 'lunch', // or dinner
        compatibleGoals: ['lose_weight', 'gain_muscle', 'health', 'maintenance'],
        blocks: [
            { category: 'protein', requiredTags: ['lunch_dinner'], amount: 1 },
            { category: 'carb', exchangeGroup: 'rice_pasta', amount: 1 },
            { category: 'carb', exchangeGroup: 'beans', amount: 1 },
            { category: 'veg', amount: 1 }
        ]
    },
    {
        id: 't_low_carb_plate',
        name: 'Prato Leve Low Carb',
        type: 'dinner',
        compatibleGoals: ['lose_weight', 'definition'],
        blocks: [
            { category: 'protein', requiredTags: ['lunch_dinner'], amount: 1.2 }, // Mais proteína para saciedade
            { category: 'veg', amount: 2 }, // Muito vegetal
            { category: 'fat', amount: 1 }
        ]
    },
    {
        id: 't_breakfast_fit',
        name: 'Café Fit',
        type: 'breakfast',
        compatibleGoals: ['gain_muscle', 'health', 'maintenance'],
        blocks: [
            { category: 'carb', exchangeGroup: 'bread', amount: 1 },
            { category: 'protein', exchangeGroup: 'eggs', amount: 1 },
            { category: 'fruit', amount: 1 }
        ]
    },
    {
        id: 't_breakfast_quick',
        name: 'Café Rápido',
        type: 'breakfast',
        compatibleGoals: ['lose_weight', 'performance'],
        blocks: [
            { category: 'protein', exchangeGroup: 'dairy_protein', amount: 1 },
            { category: 'carb', exchangeGroup: 'fruit_carb', amount: 1 },
            { category: 'carb', exchangeGroup: 'grain', amount: 0.5 }
        ]
    },
    {
        id: 't_pre_workout',
        name: 'Energia Pré-Treino',
        type: 'pre_workout',
        compatibleGoals: ['performance', 'gain_muscle'],
        blocks: [
            { category: 'carb', requiredTags: ['quick_prep', 'pre_workout'], amount: 1 }
        ]
    },
    {
        id: 't_snack_protein',
        name: 'Lanche Proteico',
        type: 'snack',
        compatibleGoals: ['lose_weight', 'definition', 'gain_muscle'],
        blocks: [
            { category: 'protein', exchangeGroup: 'dairy_protein', amount: 1 },
            { category: 'fat', exchangeGroup: 'nuts', amount: 0.5 }
        ]
    }
];

// --- BUILDER LOGIC ---

export const getSmartSubstitutionsBuilder = (item: MealItem, criteria: 'protein' | 'cheaper' | 'faster' = 'protein'): MealItem[] => {
    // Flatten DB
    const allFoods = Object.values(FOOD_DATABASE).flat();

    // Filter by Exchange Group (Base rule)
    let candidates = allFoods.filter(f => f.exchangeGroup === item.exchangeGroup && f.id !== item.id);

    // Apply Criteria
    if (criteria === 'cheaper') {
        candidates = candidates.filter(f => f.approxPrice === 'low');
    } else if (criteria === 'faster') {
        candidates = candidates.filter(f => f.tags.includes('quick_prep') || f.tags.includes('no_cook') || f.prepTime < (item.prepTime || 15));
    } else if (criteria === 'protein') {
        // Sort by protein density (g protein per portion) - simplified here just checking if protein > original
        candidates = candidates.sort((a, b) => b.macros.protein - a.macros.protein);
    }

    return candidates.slice(0, 5);
};

// Gender-based Nutrient Prioritization
const prioritizeForFemale = (candidates: MealItem[], mealType: string): MealItem[] => {
    // 1. Boost Iron for Lunch/Dinner
    if (mealType === 'lunch' || mealType === 'dinner') {
        const highIron = candidates.filter(c => c.tags.includes('rich_iron'));
        if (highIron.length > 0) return [...highIron, ...candidates.filter(c => !c.tags.includes('rich_iron'))];
    }

    // 2. Boost Calcium for Breakfast/Snack
    if (mealType === 'breakfast' || mealType === 'snack') {
        const highCalcium = candidates.filter(c => c.tags.includes('rich_calcium'));
        if (highCalcium.length > 0) return [...highCalcium, ...candidates.filter(c => !c.tags.includes('rich_calcium'))];
    }

    return candidates;
};

export const generateMealFromTemplate = (
    template: MealTemplate,
    prefs: DietPreferences
): Meal => {
    const selectedItems: MealItem[] = [];
    let instructions = "";

    template.blocks.forEach(block => {
        // Find candidates in DB
        const categoryItems = FOOD_DATABASE[block.category + 's'] || FOOD_DATABASE[block.category]; // Handle plural s

        if (!categoryItems) return;

        let candidates = categoryItems;

        // Filter by Diet Type
        if (prefs.dietType === 'vegan') candidates = candidates.filter(f => f.tags.includes('vegan'));
        if (prefs.dietType === 'vegetarian') candidates = candidates.filter(f => f.tags.includes('vegetarian') || f.tags.includes('vegan'));
        if (prefs.dietType === 'low_carb') candidates = candidates.filter(f => f.macros.carbs < 15 || f.tags.includes('low_carb'));

        // Filter by Exchange Group if specified in block
        if (block.exchangeGroup) {
            candidates = candidates.filter(f => f.exchangeGroup === block.exchangeGroup);
        }

        // Filter by Required Tags
        if (block.requiredTags) {
            candidates = candidates.filter(f => block.requiredTags!.every(t => f.tags.includes(t)));
        }

        // Random Selection (improves variety)
        if (candidates.length > 0) {
            // Apply Female Priority if Gender is Female (needs to be passed in DietPreferences ideally, or checked here)
            // Assuming prefs has gender now (we will update types/diet.ts to include it logic upstream)
            if (prefs.gender === 'female') {
                candidates = prioritizeForFemale(candidates, template.type);
            }

            // Weighted Random: Favor first elements (prioritized)
            // Simple approach: Take top 3 and pick random from them to maintain some variety but respect priority
            const poolSize = Math.min(candidates.length, 3);
            const randomIndex = Math.floor(Math.random() * poolSize);
            const selected = { ...candidates[randomIndex] };
            selected.id = Math.random().toString(36).substr(2, 9); // Unique ID for this instance
            selectedItems.push(selected);
        }
    });

    return {
        id: Math.random().toString(36).substr(2, 9),
        type: template.type,
        name: template.name,
        time: getTimeForMeal(template.type),
        items: selectedItems,
        done: false,
        prepTimeMinutes: selectedItems.reduce((acc, i) => acc + (i.prepTime || 0), 0)
    };
};

const getTimeForMeal = (type: string): string => {
    switch (type) {
        case 'breakfast': return '08:00';
        case 'lunch': return '12:30';
        case 'snack': return '16:00';
        case 'dinner': return '19:30';
        case 'pre_workout': return '17:00';
        case 'post_workout': return '19:00'; // Assume workout at 18
        default: return '12:00';
    }
};

export const buildDailyPlan = (prefs: DietPreferences): Meal[] => {
    const meals: Meal[] = [];

    // 1. Define Template Schedule based on Preferences
    const schedule: MealTemplate[] = [];

    // Breakfast
    schedule.push(prefs.cookingTime === 'fast' ? MEAL_TEMPLATES.find(t => t.id === 't_breakfast_quick')! : MEAL_TEMPLATES.find(t => t.id === 't_breakfast_fit')!);

    // Lunch
    schedule.push(MEAL_TEMPLATES.find(t => t.id === 't_plate_traditional')!);

    // Snack?
    if (prefs.mealsPerDay >= 4) {
        schedule.push(MEAL_TEMPLATES.find(t => t.id === 't_snack_protein')!);
    }

    // Dinner
    if (prefs.goal === 'lose_weight' || prefs.dietType === 'low_carb') {
        schedule.push(MEAL_TEMPLATES.find(t => t.id === 't_low_carb_plate')!);
    } else {
        // Reuse plate but maybe different variation in future
        schedule.push({ ...MEAL_TEMPLATES.find(t => t.id === 't_plate_traditional')!, name: 'Jantar' });
    }

    // Pre/Post Workout logic would go here if we tracked workout time

    // 2. Build Meals
    schedule.forEach(template => {
        if (template) {
            meals.push(generateMealFromTemplate(template, prefs));
        }
    });

    return meals;
};
