export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio' | 'full_body';
export type ExerciseCategory = 'compound' | 'isolation' | 'machine' | 'bodyweight' | 'cardio' | 'mobility' | 'functional';
export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced';
export type Equipment =
    | 'gym'
    | 'home_dumbbells'
    | 'bodyweight_only'
    | 'resistance_band'
    | 'kettlebell'
    | 'pull_up_bar'
    | 'bench'
    | 'sandbag' // Optional improvisation
    | 'backpack' // Optional improvisation
    | 'rack' // Squat rack / cage
    | 'swiss_ball'
    | 'step_platform'
    | 'barbell'
    | 'plate'
    | 'machine'
    | 'cable_machine';
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseStimulus = 'strength' | 'hypertrophy' | 'endurance' | 'cardio_respiratory' | 'power';
export type ExerciseMechanic = 'compound' | 'isolation';

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    secondaryMuscles?: MuscleGroup[];
    category: ExerciseCategory;
    equipment: Equipment[];
    description: string;
    difficulty: ExerciseDifficulty;
    stimulus: ExerciseStimulus[]; // Changed to array
    mechanic: ExerciseMechanic;
    isMetabolic?: boolean; // New flag
    isMobility?: boolean; // New flag
    lowImpactAlt?: string; // ID of low impact alternative
    videoUrl?: string; // Placeholder for GIF/Video
    gifUrl?: string; // URL for the animated GIF demonstration
    tags?: string[]; // "#feminino", "#lumbar_risk", etc.
    tips: string[]; // "Keep back straight", etc.
    instructions?: string[]; // Detailed step-by-step instructions
}

export interface WorkoutSet {
    id: string;
    type: 'warmup' | 'working' | 'cooldown';
    reps: string; // "8-12" or "10"
    weight?: number; // kg
    rpe?: number; // 1-10
    restSeconds: number;
    completed: boolean;
}

export interface WorkoutExercise {
    exerciseId: string;
    exerciseName: string; // Denormalized for easy access
    sets: WorkoutSet[];
    notes?: string;
}

export interface WorkoutSession {
    id: string;
    title: string;
    description?: string;
    dayLabel: string; // "D1", "Segunda", etc.
    focus: string; // "Upper Body", "Legs"
    warmup: string[]; // Simple text instructions for warmup
    exercises: WorkoutExercise[];
    cooldown: string[];
    estimatedDuration: number; // minutes
    duration?: number; // In minutes
    completed: boolean;
    feedback?: 'easy' | 'ok' | 'hard';
}

export interface WeeklyPlan {
    id: string;
    name: string;
    level: TrainingLevel;
    goal: string;
    sessions: WorkoutSession[]; // Array of sessions for the week
}
