import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyPlan, DietPreferences, MealItem } from '../types/diet';
import { generateDailyPlan } from '../lib/dietLogic';
import { useUserStore } from './userStore';

interface DietStore {
    preferences: DietPreferences | null;
    currentPlan: DailyPlan | null;
    waterConsumed: number;
    learningProfile: LearningProfile;
    coachMessages: CoachingMessage[];

    // Actions
    setPreferences: (prefs: DietPreferences) => void;
    generatePlan: () => void;
    addWater: (amount: number) => void;
    resetDiet: () => void;

    // AI Actions
    logInteraction: (type: 'like' | 'dislike' | 'skip', itemId?: string, mealType?: string) => void;
    addToPantry: (itemIds: string[]) => void;
    removeFromPantry: (itemIds: string[]) => void;
    dismissCoachMessage: (id: string) => void;
    generateCoachInsights: () => void;
    setCoachMessages: (messages: CoachingMessage[]) => void;
}

import { CoachingMessage, LearningProfile } from '../types/diet';

export const useDietStore = create<DietStore>()(
    persist(
        (set, get) => ({
            preferences: null,
            currentPlan: null, // Deprecated, keeping for interface compatibility if needed, but unused
            waterConsumed: 0,
            learningProfile: {
                favoriteItems: {},
                replacedItems: {},
                skippedMeals: {},
                pantry: [],
                lastInteraction: new Date().toISOString()
            },
            coachMessages: [],

            setPreferences: (prefs) => {
                set({ preferences: prefs });
                get().generatePlan();
            },

            generatePlan: () => {
                const prefs = get().preferences;
                if (!prefs) return;

                const newPlan = generateDailyPlan(prefs);
                // Update USER STORE (Single Source of Truth)
                useUserStore.getState().setDailyPlan(newPlan);

                // Legacy: Update local state for components still using dietStore
                set({ currentPlan: newPlan, waterConsumed: 0 });
            },



            addWater: (amount) => {
                set(state => ({ waterConsumed: state.waterConsumed + amount }));
            },

            resetDiet: () => set({ preferences: null, currentPlan: null, waterConsumed: 0 }),

            // --- AI Actions ---
            logInteraction: (type, itemId, mealType) => {
                set(state => {
                    const profile = { ...state.learningProfile };
                    profile.lastInteraction = new Date().toISOString();

                    if (type === 'like' && itemId) {
                        profile.favoriteItems[itemId] = (profile.favoriteItems[itemId] || 0) + 1;
                    }
                    // Simplification: logic for dislike/skip can be added here
                    return { learningProfile: profile };
                });
            },

            addToPantry: (itemIds) => {
                set(state => ({
                    learningProfile: {
                        ...state.learningProfile,
                        pantry: [...new Set([...state.learningProfile.pantry, ...itemIds])]
                    }
                }));
            },

            removeFromPantry: (itemIds) => {
                set(state => ({
                    learningProfile: {
                        ...state.learningProfile,
                        pantry: state.learningProfile.pantry.filter(id => !itemIds.includes(id))
                    }
                }));
            },

            dismissCoachMessage: (id) => {
                set(state => ({
                    coachMessages: state.coachMessages.map(m => m.id === id ? { ...m, dismissed: true } : m)
                }));
            },

            generateCoachInsights: () => {
                // Placeholder: In a real app, this would analyze history and generate messages
                // logic moved to a separate function or triggered here
            },

            setCoachMessages: (messages) => set({ coachMessages: messages })
        }),
        {
            name: 'axion-core-diet-storage',
            version: 2, // Incrementado para forçar reset do cache antigo
            migrate: (persistedState: any, version: number) => {
                if (version < 2) {
                    // Version bump forces complete reset of diet state to apply new logic
                    return {
                        preferences: null,
                        currentPlan: null,
                        waterConsumed: 0,
                        learningProfile: {
                            favoriteItems: {},
                            replacedItems: {},
                            skippedMeals: {},
                            pantry: [],
                            lastInteraction: new Date().toISOString()
                        },
                        coachMessages: []
                    };
                }
                return persistedState;
            }
        }
    )
);
