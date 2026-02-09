import { useUserStore } from '../store/userStore';
import { useDietStore } from '../store/dietStore';
import { useEvolutionStore } from '../store/evolutionStore';

export interface AIContext {
    user: {
        name: string;
        goal: string;
        weight: number | null;
    };
    today: {
        water: number;
        waterTarget: number;
        workoutCompleted: boolean;
        mealsCompleted: number;
        totalMeals: number;
        routineCompletion: number;
        nutrition: {
            calories: { consumed: number; target: number };
            protein: { consumed: number; target: number };
            carbs: { consumed: number; target: number };
            fat: { consumed: number; target: number };
        };
    };
    history: {
        lastWorkout?: string;
        weightTrend: 'up' | 'down' | 'stable';
        recentPR?: string;
    };
}

export const buildCoachContext = (): AIContext => {
    const userState = useUserStore.getState();
    const dietState = useDietStore.getState();
    const evolutionState = useEvolutionStore.getState();

    const plan = userState.dailyPlan;
    const dietPlan = dietState.currentPlan;
    const profile = userState.profile;

    // Calculate Routine
    const routineItems = plan?.routineItems || [];
    const doneRoutine = routineItems.filter(i => i.completed).length;
    const routineRate = routineItems.length > 0 ? (doneRoutine / routineItems.length) * 100 : 0;

    // Calculate Meals (Unified with Diet Tab)
    const activeMeals = dietPlan?.meals || plan?.meals || [];
    const doneMeals = activeMeals.filter((m: any) => m.done).length;
    const totalMeals = activeMeals.length;

    // Calculate Detailed Nutrition (from dietStore)
    let nutrition = {
        calories: { consumed: 0, target: 0 },
        protein: { consumed: 0, target: 0 },
        carbs: { consumed: 0, target: 0 },
        fat: { consumed: 0, target: 0 }
    };

    if (dietPlan) {
        dietPlan.meals.forEach(meal => {
            const mealCalories = meal.items?.reduce((acc, item) => acc + item.calories, 0) || meal.calories || 0;
            const mealProtein = meal.items?.reduce((acc, item) => acc + item.macros.protein, 0) || 0;
            const mealCarbs = meal.items?.reduce((acc, item) => acc + item.macros.carbs, 0) || 0;
            const mealFat = meal.items?.reduce((acc, item) => acc + item.macros.fat, 0) || 0;

            nutrition.calories.target += mealCalories;
            nutrition.protein.target += mealProtein;
            nutrition.carbs.target += mealCarbs;
            nutrition.fat.target += mealFat;

            if (meal.done) {
                nutrition.calories.consumed += mealCalories;
                nutrition.protein.consumed += mealProtein;
                nutrition.carbs.consumed += mealCarbs;
                nutrition.fat.consumed += mealFat;
            }
        });
    }

    // Water
    const water = userState.waterIntake || 0;
    const waterTarget = plan?.meta?.waterTarget || 2500;

    // History & Trends
    const bodyRecords = evolutionState.bodyRecords || [];
    let weightTrend: 'up' | 'down' | 'stable' = 'stable';
    if (bodyRecords.length >= 2) {
        const current = bodyRecords[0].weight;
        const previous = bodyRecords[1].weight;
        if (current > previous) weightTrend = 'up';
        if (current < previous) weightTrend = 'down';
    }

    return {
        user: {
            name: profile?.name || 'Atleta',
            goal: profile?.goal || 'Saúde',
            weight: bodyRecords[0]?.weight || profile?.weight || null
        },
        today: {
            water,
            waterTarget,
            workoutCompleted: !!plan?.workout?.completed,
            mealsCompleted: doneMeals,
            totalMeals,
            routineCompletion: routineRate,
            nutrition
        },
        history: {
            weightTrend
        }
    };
};
