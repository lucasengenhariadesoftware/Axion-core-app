import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateDistance } from '../lib/runLogic';

export interface LatLng {
    lat: number;
    lng: number;
    timestamp: number;
    accuracy?: number;
}

export interface RunSession {
    id: string;
    startTime: number;
    endTime?: number;
    duration: number; // in seconds
    distance: number; // in meters
    path: LatLng[];
    calories: number;
    pace: number; // minutes per km
}

interface RunState {
    status: 'ready' | 'running' | 'paused' | 'finished';
    currentRun: RunSession | null;
    history: RunSession[];

    // Actions
    startRun: () => void;
    pauseRun: () => void;
    resumeRun: () => void;
    stopRun: () => void;
    updateRun: (position: LatLng) => void;
    tickTimer: () => void;
    saveRun: () => void;
    discardRun: () => void;
    deleteFromHistory: (id: string) => void;
}


export const useRunStore = create<RunState>()(
    persist(
        (set, get) => ({
            status: 'ready',
            currentRun: null,
            history: [],

            startRun: () => {
                const now = Date.now();
                set({
                    status: 'running',
                    currentRun: {
                        id: crypto.randomUUID(),
                        startTime: now,
                        duration: 0,
                        distance: 0,
                        path: [],
                        calories: 0,
                        pace: 0
                    }
                });
            },

            pauseRun: () => set({ status: 'paused' }),

            resumeRun: () => set({ status: 'running' }),

            stopRun: () => {
                const { currentRun } = get();
                if (currentRun) {
                    set({
                        status: 'finished',
                        currentRun: { ...currentRun, endTime: Date.now() }
                    });
                } else {
                    set({ status: 'ready' });
                }
            },

            updateRun: (position) => {
                const { status, currentRun } = get();
                if (status !== 'running' || !currentRun) return;

                const lastPoint = currentRun.path[currentRun.path.length - 1];
                let distIncrement = 0;

                // Basic filtering: ignore points with bad accuracy (> 50m) unless it's the first point
                if (position.accuracy && position.accuracy > 50 && currentRun.path.length > 0) {
                    return; // Skip noisy point
                }

                if (lastPoint) {
                    distIncrement = calculateDistance(lastPoint, position);
                    // Filter jitter: ignore very small movements (< 2m) if moving very slowly
                    if (distIncrement < 2) return;
                }

                const newDistance = currentRun.distance + distIncrement;

                // Estimate Calories (Simple METs approximation: Running ~ 9 METs)
                // Calories = MET * Weight(kg) * Time(hours). Assuming default 70kg if unknown.
                // We'll calculate incremental calories. 
                // Better approach: Total Cal = Distance (km) * Weight (kg) * 1.036
                const weight = 70; // TODO: Get from UserStore
                const newCalories = (newDistance / 1000) * weight * 1.036;

                // Calculate Average Pace (min/km)
                // Avoid division by zero
                const pace = newDistance > 0 ? (currentRun.duration / 60) / (newDistance / 1000) : 0;

                set({
                    currentRun: {
                        ...currentRun,
                        path: [...currentRun.path, position],
                        distance: newDistance,
                        calories: newCalories,
                        pace: pace
                    }
                });
            },

            tickTimer: () => {
                const { status, currentRun } = get();
                if (status === 'running' && currentRun) {
                    set({
                        currentRun: {
                            ...currentRun,
                            duration: currentRun.duration + 1
                        }
                    });
                }
            },

            saveRun: () => {
                const { currentRun, history } = get();
                if (currentRun) {
                    set({
                        history: [currentRun, ...history],
                        currentRun: null,
                        status: 'ready'
                    });
                }
            },

            discardRun: () => set({ currentRun: null, status: 'ready' }),

            deleteFromHistory: (id) => {
                set((state) => ({
                    history: state.history.filter(run => run.id !== id)
                }));
            }
        }),
        {
            name: 'axion-core-run-storage',
            partialize: (state) => ({ history: state.history }), // Only persist history
        }
    )
);
