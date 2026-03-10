import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BodyMeasures {
    chest: number;
    waist: number;
    abdomen: number;
    hips: number;
    armRight: number;
    armLeft: number;
    thighRight: number;
    thighLeft: number;
    calfRight: number;
    calfLeft: number;
}

import { BodyRecord } from '../types/index';
export type { BodyRecord };

export interface ExerciseRecord {
    id: string;
    date: string;
    exerciseName: string;
    weight: number;
    reps: number;
    sets: number;
}

interface EvolutionState {
    bodyRecords: BodyRecord[];
    exerciseRecords: ExerciseRecord[];

    addBodyRecord: (record: Omit<BodyRecord, 'id'>) => void;
    deleteBodyRecord: (id: string) => void;

    addExerciseRecord: (record: Omit<ExerciseRecord, 'id'>) => void;
    deleteExerciseRecord: (id: string) => void;
}

export const useEvolutionStore = create<EvolutionState>()(
    persist(
        (set) => ({
            bodyRecords: [],
            exerciseRecords: [],

            addBodyRecord: (record) => set((state) => ({
                bodyRecords: [
                    ...state.bodyRecords,
                    { ...record, id: crypto.randomUUID() }
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Newest first
            })),

            deleteBodyRecord: (id) => set((state) => ({
                bodyRecords: state.bodyRecords.filter((r) => r.id !== id)
            })),

            addExerciseRecord: (record) => set((state) => ({
                exerciseRecords: [
                    ...state.exerciseRecords,
                    { ...record, id: crypto.randomUUID() }
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            })),

            deleteExerciseRecord: (id) => set((state) => ({
                exerciseRecords: state.exerciseRecords.filter((r) => r.id !== id)
            })),
        }),
        {
            name: 'axion-core-evolution-storage',
        }
    )
);
