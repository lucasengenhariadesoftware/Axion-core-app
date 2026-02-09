import { DailyPlan } from './diet';

export * from './diet';
export * from './workout';

export type Gender = 'male' | 'female';
export type Goal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'definition' | 'glute_growth' | 'health_female' | 'force_female' | 'post_partum' | 'force_max' | 'athletic' | 'longevity';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

import { TrainingLevel, Equipment } from './workout';

export interface UserProfile {
    name: string;
    gender: Gender;
    age: number;
    birthDate?: string; // YYYY-MM-DD
    height: number; // cm
    weight: number; // kg
    goal: Goal;
    activityLevel: ActivityLevel;
    trainingLevel?: TrainingLevel;
    workoutMode?: 'gym' | 'home'; // New
    homeEquipment?: Equipment[]; // New
    dietaryRestrictions: string[];
    photo?: string;
}

export interface BodyMeasures {
    chest?: number;
    waist?: number;
    abdomen?: number;
    hips?: number;
    neck?: number;
    shoulders?: number;
    armRight?: number;
    armLeft?: number;
    forearmRight?: number;
    forearmLeft?: number;
    thighRight?: number;
    thighLeft?: number;
    calfRight?: number;
    calfLeft?: number;
}

export interface BodyRecord {
    id: string;
    date: string;
    weight: number;
    measures?: BodyMeasures;
    photos?: {
        front?: string;
        side?: string;
        back?: string;
    };
    notes?: string;
}

import { WeeklyPlan } from './workout';

export interface UserState {
    profile: UserProfile | null;
    onboardingCompleted: boolean;
    bodyRecords: BodyRecord[];

    // Daily Tracking
    dailyPlan: DailyPlan | null;
    weeklyPlan: WeeklyPlan | null; // Added persistence
    waterIntake: number;
    lastPlanDate: string | null;

    // Actions
    isOnboarded: () => boolean;
    completeOnboarding: (profile: UserProfile, initialPlan: DailyPlan) => void;
    updateProfile: (profile: Partial<UserProfile>) => void;

    addBodyRecord: (record: BodyRecord) => void;
    deleteBodyRecord: (id: string) => void;
    addRoutineItem: (item: any) => void;
    removeRoutineItem: (id: string) => void;
    toggleRoutineItem: (id: string) => void;

    setDailyPlan: (plan: DailyPlan) => void;
    setWeeklyPlan: (plan: WeeklyPlan) => void; // Added action
    toggleMeal: (id: string) => void;
    toggleWorkout: () => void;
    addWater: (amount: number) => void;
    checkDailyReset: (todayDate: string, newPlan: DailyPlan) => void;
}
