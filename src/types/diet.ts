
export type Goal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'definition' | 'glute_growth' | 'health_female' | 'force_female' | 'post_partum';
export type DietType = 'omnivore' | 'vegetarian' | 'vegan' | 'low_carb';
export type CookingTime = 'fast' | 'moderate' | 'elaborate';

export type Gender = 'male' | 'female';

export interface DietPreferences {
    goal: Goal;
    dietType: DietType;
    cookingTime: CookingTime; // 'fast' = 15min, 'moderate' = 30min
    mealsPerDay: 3 | 4 | 5 | 6;
    allergies: string[]; // ['lactose', 'gluten', 'peanuts', etc]
    isSimpleMode: boolean; // Menos opções, mais direto
    budget: 'economic' | 'standard' | 'premium';
    gender?: Gender;
}

export type FoodTag =
    | 'vegan' | 'vegetarian' | 'gluten_free' | 'lactose_free'
    | 'high_protein' | 'low_carb' | 'low_fat'
    | 'quick_prep' | 'no_cook'
    | 'cheap' | 'premium'
    | 'breakfast' | 'lunch_dinner' | 'snack' | 'pre_workout' | 'post_workout'
    | 'rich_iron' | 'rich_calcium' | 'cycle_folicular' | 'cycle_luteal' | 'anti_inflammatory'
    | 'health' | 'comfort';

export interface MealItem {
    id: string;
    name: string;
    portion: string; // Ex: "1 palma", "2 colheres", "1 unidade"
    category: 'protein' | 'carb' | 'fat' | 'veg' | 'fruit' | 'dairy' | 'drink' | 'spice';
    image?: string;
    exchangeGroup?: string; // Para facilitar substituições
    tags: FoodTag[];

    // Metadata novo
    calories: number;
    macros: { protein: number; carbs: number; fat: number }; // porção
    approxPrice: 'low' | 'medium' | 'high';
    prepTime: number; // minutos
    prepMethod?: string; // "Grelhado", "Assado", "Crú"
}

export interface MealBlockRule {
    category: MealItem['category'];
    exchangeGroup?: string; // Opcional: restringe a um subgrupo específico (ex: 'carb_complex')
    amount: number; // Multiplicador de porção base (1 = 1 porção padrão)
    requiredTags?: FoodTag[];
}

export interface MealTemplate {
    id: string;
    name: string;
    type: Meal['type'];
    blocks: MealBlockRule[];
    compatibleGoals: Goal[];
}

export interface Meal {
    id: string;
    type: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'pre_workout' | 'post_workout';
    name: string; // "Café da Manhã", "Almoço"
    items?: MealItem[];
    done: boolean;
    time?: string; // "08:00"
    prepTimeMinutes?: number;
    description?: string;
    calories?: number;
}

import { WorkoutSession } from './workout';

export interface RoutineItem {
    id: string;
    title: string;
    startTime: string; // "08:00"
    endTime: string; // "17:00"
    completed: boolean;
    type: 'work' | 'study' | 'training' | 'other';
    alarmEnabled?: boolean;
    // isTemplate?: boolean; // If true, copied every day. For now, we manually manage.
}

export interface DailyPlan {
    date: string; // YYYY-MM-DD
    meals: Meal[];
    workout?: WorkoutSession;
    routineItems?: RoutineItem[]; // New field
    meta: {
        totalCalories?: number;
        protein?: number; // gramas
        waterTarget: number; // ml
        focus: string; // "Energia" | "Recuperação" | "Leve"
    };
}

export interface CoachingMessage {
    id: string;
    type: 'suggestion' | 'insight' | 'warning';
    category?: 'habit' | 'economy' | 'health' | 'time'; // Para ícone/contexto específico
    title?: string; // Título curto e grosso (ex: "Mudança Detectada")
    text: string;
    actionLabel?: string;
    actionData?: any;
    dismissed?: boolean;
}

export interface LearningProfile {
    favoriteItems: Record<string, number>; // ID -> count
    replacedItems: Record<string, number>; // ID -> count
    skippedMeals: Record<string, number>; // MealType -> count
    pantry: string[]; // IDs of items in fridge
    lastInteraction: string;
}

export interface ShoppingListItem {
    id: string;
    name: string;
    category: string;
    amount: number;
    unit: string;
    checked: boolean;
}
