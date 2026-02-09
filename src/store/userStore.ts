import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, UserProfile, DailyPlan } from '../types';
import { MealItem } from '../types/diet';

export interface DailyStats {
    date: string;
    calories: number;
    protein: number;
    water: number;
    workoutCompleted: boolean;
    workoutDuration: number;
}

interface UserStateWithHistory extends UserState {
    history: DailyStats[];
    isPremium: boolean;
    setPremium: (status: boolean) => void;
    swapMealItem: (mealId: string, oldItemId: string, newItem: MealItem) => void;
}

export const useUserStore = create<UserStateWithHistory>()(
    persist(
        (set, get) => ({
            profile: null,
            onboardingCompleted: false,
            bodyRecords: [],
            dailyPlan: null,
            weeklyPlan: null,
            waterIntake: 0,
            lastPlanDate: null,
            history: [],
            isPremium: false,

            setPremium: (status: boolean) => set({ isPremium: status }),

            isOnboarded: () => {
                return get().onboardingCompleted && get().profile !== null;
            },

            addBodyRecord: (record) => {
                set((state) => ({
                    bodyRecords: [record, ...state.bodyRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                }));
            },

            deleteBodyRecord: (id) => {
                set((state) => ({
                    bodyRecords: state.bodyRecords.filter((r) => r.id !== id)
                }));
            },

            completeOnboarding: (profile: UserProfile, initialPlan: DailyPlan) => {
                set({
                    profile,
                    onboardingCompleted: true,
                    dailyPlan: initialPlan,
                    waterIntake: 0,
                    lastPlanDate: new Date().toDateString()
                });
            },

            updateProfile: (updates) => {
                set((state) => ({
                    profile: state.profile ? { ...state.profile, ...updates } : null
                }));
            },

            setDailyPlan: (plan: DailyPlan) => {
                set({ dailyPlan: plan, lastPlanDate: new Date().toDateString() });
            },

            setWeeklyPlan: (plan) => {
                set({ weeklyPlan: plan });
            },

            toggleMeal: (id: string) => {
                const plan = get().dailyPlan;
                if (!plan) return;

                const updatedMeals = plan.meals.map((m) =>
                    m.id === id ? { ...m, done: !m.done } : m
                );

                set({ dailyPlan: { ...plan, meals: updatedMeals } });
            },

            swapMealItem: (mealId: string, oldItemId: string, newItem: MealItem) => {
                const plan = get().dailyPlan;
                if (!plan) return;

                const updatedMeals = plan.meals.map(m => {
                    if (m.id !== mealId) return m;
                    // Replace item logic
                    const newItems = (m.items || []).map(i => i.id === oldItemId || i.id.startsWith(oldItemId) ? { ...newItem, id: Math.random().toString() } : i);
                    return { ...m, items: newItems };
                });

                set({ dailyPlan: { ...plan, meals: updatedMeals } });
            },

            toggleWorkout: () => {
                const plan = get().dailyPlan;
                if (!plan || !plan.workout) return;

                set({ dailyPlan: { ...plan, workout: { ...plan.workout, completed: !plan.workout.completed } } });
            },

            addRoutineItem: (item: any) => {
                const plan = get().dailyPlan;
                if (!plan) return;
                const currentItems = plan.routineItems || [];
                set({
                    dailyPlan: {
                        ...plan,
                        routineItems: [...currentItems, item].sort((a, b) => a.startTime.localeCompare(b.startTime))
                    }
                });
            },

            removeRoutineItem: (id: string) => {
                const plan = get().dailyPlan;
                if (!plan) return;
                set({
                    dailyPlan: {
                        ...plan,
                        routineItems: (plan.routineItems || []).filter(i => i.id !== id)
                    }
                });
            },

            toggleRoutineItem: (id: string) => {
                const plan = get().dailyPlan;
                if (!plan) return;
                const updatedItems = (plan.routineItems || []).map(i =>
                    i.id === id ? { ...i, completed: !i.completed } : i
                );
                set({ dailyPlan: { ...plan, routineItems: updatedItems } });
            },

            addWater: (amount: number) => {
                set((state) => {
                    const max = state.dailyPlan ? state.dailyPlan.meta.waterTarget + 1000 : 4000;
                    return { waterIntake: Math.min(state.waterIntake + amount, max) };
                });
            },

            checkDailyReset: (todayDate: string, newPlan: DailyPlan) => {
                const lastDate = get().lastPlanDate;
                if (lastDate !== todayDate) {
                    // Archive previous day stats
                    const previousPlan = get().dailyPlan;
                    if (previousPlan) {
                        const completedMeals = previousPlan.meals.filter(m => m.done);

                        const totalCalories = completedMeals.reduce((acc, m) => {
                            if (m.calories) return acc + m.calories;
                            return acc + (m.items?.reduce((sum, item) => sum + item.calories, 0) || 0);
                        }, 0);

                        const totalProtein = completedMeals.reduce((acc, m) => {
                            return acc + (m.items?.reduce((sum, item) => sum + item.macros.protein, 0) || 0);
                        }, 0);

                        const workoutDone = previousPlan.workout?.completed || false;
                        const workoutDuration = workoutDone ? (previousPlan.workout?.estimatedDuration || 45) : 0;

                        const dailyStat: DailyStats = {
                            date: lastDate || new Date().toISOString().split('T')[0], // Fallback if null
                            calories: totalCalories,
                            protein: totalProtein,
                            water: get().waterIntake,
                            workoutCompleted: workoutDone,
                            workoutDuration: workoutDuration
                        };

                        set(state => ({
                            history: [...state.history, dailyStat].slice(-30) // Keep last 30 days
                        }));
                    }

                    // It's a new day! Reset progress but keep profile
                    console.log("New day detected! Resetting plan.");
                    set({
                        dailyPlan: newPlan,
                        waterIntake: 0,
                        lastPlanDate: todayDate
                    });
                }
            }
        }),
        {
            name: 'axion-core-user-storage',
        }
    )
);
