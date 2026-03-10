import { UserProfile, Gender } from '../types';
import { WeeklyPlan, WorkoutSession, WorkoutExercise, WorkoutSet, TrainingLevel, MuscleGroup, ExerciseCategory, ExerciseStimulus, ExerciseMechanic, ExerciseDifficulty, Exercise, Equipment } from '../types/workout';
import { EXERCISE_LIBRARY } from '../data/exercises';

// --- HELPERS ---

const createSet = (type: 'warmup' | 'working' | 'cooldown', reps: string, rest: number): WorkoutSet => ({
    id: Math.random().toString(36).substr(2, 9),
    type,
    reps,
    restSeconds: rest,
    completed: false
});

/**
 * The "Brain" of the selector.
 * Tries to find the best matching exercise based on constraints.
 * Falls back gracefully by relaxing constraints if needed.
 */
const getSmartExercise = (
    criteria: {
        group: MuscleGroup;
        maxDifficulty?: TrainingLevel; // User's level acts as a ceiling
        stimulus?: ExerciseStimulus;
        mechanic?: ExerciseMechanic;
        exclude?: string[];
        forceCategory?: ExerciseCategory; // Optional: strict category override
        availableEquipment?: Equipment[]; // New: Filter by gear
        prioritizeTags?: string[];
        avoidTags?: string[];
    }
): string => {
    const allExercises = Object.values(EXERCISE_LIBRARY);
    const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
    const userLevelIdx = difficultyLevels.indexOf(criteria.maxDifficulty || 'advanced');

    // Filter Step 1: Strict Match
    let candidates = allExercises.filter(ex => {
        // Exclusions
        if (criteria.exclude?.includes(ex.id)) return false;

        // Avoid Tags (Safety) - STRICT
        if (criteria.avoidTags?.length && ex.tags?.some(t => criteria.avoidTags!.includes(t))) return false;

        // Equipment Check
        if (criteria.availableEquipment) {
            // Exercise is playable if it lists at least one equipment that the user HAS.
            // ex.equipment=['gym'] -> User['bodyweight'] -> False
            // ex.equipment=['bodyweight'] -> User['gym'] -> True (Gym has bodyweight)
            // ex.equipment=['home_dumbbells'] -> User['bodyweight'] -> False
            const hasGear = ex.equipment.some(req => criteria.availableEquipment?.includes(req));
            if (!hasGear) return false;
        }

        // Group Logic
        const isPrimary = ex.muscleGroup === criteria.group;
        const isSecondary = ex.secondaryMuscles?.includes(criteria.group);

        // Rule: If we want a specific muscle group (e.g. 'legs'), do NOT accept 'cardio' or 'mobility' category exercises unless we specifically asked for 'cardio' group or category.
        if (criteria.group !== 'cardio' && criteria.group !== 'full_body' && !criteria.forceCategory) {
            if (ex.category === 'cardio' || ex.category === 'mobility' || ex.category === 'functional') return false;
        }

        // Rule: For 'arms', 'shoulders', 'chest', 'back', 'legs', strictly prefer PRIMARY match if possible.
        // But allow secondary if it's a compound lift that hits it hard (e.g. Bench for Triceps?). 
        // actually, simpler: Just enforce Primary match for these unless we're desperate.
        // Let's stick to: Must be Primary OR (Secondary AND strict mechanics match).
        if (!isPrimary && !isSecondary) return false;

        // Difficulty Ceiling
        const exLevelIdx = difficultyLevels.indexOf(ex.difficulty);
        if (exLevelIdx > userLevelIdx) return false;

        // Exact Filters
        if (criteria.mechanic && ex.mechanic !== criteria.mechanic) return false;
        if (criteria.stimulus && !ex.stimulus.includes(criteria.stimulus)) return false;
        if (criteria.forceCategory && ex.category !== criteria.forceCategory) return false;

        return true;
    });

    // Priority Filter: If we have valid candidates, try to find ones matching priority tags
    if (candidates.length > 0 && criteria.prioritizeTags?.length) {
        const strictPriority = candidates.filter(ex => ex.tags?.some(t => criteria.prioritizeTags!.includes(t)));
        if (strictPriority.length > 0) candidates = strictPriority;
    }

    // --- NEW: Equipment Quality Sort (Heavy > Light) ---
    // If we have gym access (or no restrictions), prefer Barbell/Machine over Bodyweight for main lifts
    if (candidates.length > 0) {
        const getTier = (ex: any): number => {
            const bestGear = ex.equipment || [];
            if (bestGear.includes('barbell') || bestGear.includes('rack') || bestGear.includes('machine') || bestGear.includes('cable_machine') || bestGear.includes('gym')) return 1;
            if (bestGear.includes('home_dumbbells') || bestGear.includes('kettlebell') || bestGear.includes('pull_up_bar') || bestGear.includes('bench')) return 2;
            return 3; // Bodyweight/Bands
        };

        // If specific gear was requested, we only care about that. 
        // But if we are in "Gym Mode" (availableEquipment is undefined or includes 'gym'), we want the best stuff.
        const gymMode = !criteria.availableEquipment || criteria.availableEquipment.includes('gym');

        if (gymMode) {
            const priorities = candidates.map(c => ({ id: c.id, tier: getTier(c) }));
            const bestTier = Math.min(...priorities.map(p => p.tier));
            // Keep only the best tier exercises (e.g. only Barbell stuff if available)
            candidates = candidates.filter(c => getTier(c) === bestTier);
        }
    }

    // Fallback: If Strict failed, try relaxing 'stimulus' but KEEP the category/muscle safety (don't give me cardio for legs)
    if (candidates.length === 0 && criteria.stimulus) {
        candidates = allExercises.filter(ex => {
            if (criteria.exclude?.includes(ex.id)) return false;

            // Equipment Check (Copied)
            if (criteria.availableEquipment) {
                const hasGear = ex.equipment.some(req => criteria.availableEquipment?.includes(req));
                if (!hasGear) return false;
            }

            // Same Safety Checks
            if (criteria.group !== 'cardio' && criteria.group !== 'full_body' && !criteria.forceCategory) {
                if (ex.category === 'cardio' || ex.category === 'mobility' || ex.category === 'functional') return false;
            }

            const isPrimary = ex.muscleGroup === criteria.group;
            const isSecondary = ex.secondaryMuscles?.includes(criteria.group);
            if (!isPrimary && !isSecondary) return false;

            if (difficultyLevels.indexOf(ex.difficulty) > userLevelIdx) return false;

            if (criteria.mechanic && ex.mechanic !== criteria.mechanic) return false;
            // Dropped stimulus check
            return true;
        });

        // --- NEW: Equipment Quality Sort (Heavy > Light) - REPEATED for fallback ---
        const gymMode = !criteria.availableEquipment || criteria.availableEquipment.includes('gym');
        if (candidates.length > 0 && gymMode) {
            const getTier = (ex: any): number => {
                const bestGear = ex.equipment || [];
                if (bestGear.includes('barbell') || bestGear.includes('rack') || bestGear.includes('machine') || bestGear.includes('cable_machine') || bestGear.includes('gym')) return 1;
                if (bestGear.includes('home_dumbbells') || bestGear.includes('kettlebell') || bestGear.includes('pull_up_bar') || bestGear.includes('bench')) return 2;
                return 3;
            };
            const priorities = candidates.map(c => ({ id: c.id, tier: getTier(c) }));
            const bestTier = Math.min(...priorities.map(p => p.tier));
            candidates = candidates.filter(c => getTier(c) === bestTier);
        }
    }

    // Fallback 2: Drop Mechanic requirement (e.g. allow isolation when compound requested if none exist)
    if (candidates.length === 0 && criteria.mechanic) {
        candidates = allExercises.filter(ex => {
            if (criteria.exclude?.includes(ex.id)) return false;

            // Equipment Check (Copied)
            if (criteria.availableEquipment) {
                const hasGear = ex.equipment.some(req => criteria.availableEquipment?.includes(req));
                if (!hasGear) return false;
            }

            if (ex.muscleGroup !== criteria.group && !ex.secondaryMuscles?.includes(criteria.group)) return false;
            if (difficultyLevels.indexOf(ex.difficulty) > userLevelIdx) return false;
            return true;
        });
    }

    if (candidates.length === 0) return 'jumping_jack'; // Ultimate Fail-safe (Singular)

    // Weighted Random Selection could go here (prioritize 'compound' if not specified)
    // For now, pure random from valid candidates
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    return selected.id;
};

// Helper: Smart Arm Sequencer (Mass -> Stretch -> Peak)
function getSmartArmSequence(
    target: 'biceps' | 'triceps',
    count: number,
    usedIds: string[] = []
): Exercise[] {
    const all = Object.values(EXERCISE_LIBRARY);
    const pool = all.filter(e => e.muscleGroup === 'arms' && !usedIds.includes(e.id));

    // Categorize
    const mass = pool.filter(e => {
        // Biceps: Barbell, Dumbbell
        if (target === 'biceps') return e.id.includes('barbell') || e.id.includes('dumbbell');
        // Triceps: Dip, Close Grip, Skullcrusher
        return e.id.includes('dip') || e.id.includes('skull');
    });

    const stretch = pool.filter(e => {
        // Biceps: Incline
        if (target === 'biceps') return e.id.includes('incline');
        // Triceps: French (Overhead)
        return e.id.includes('french') || e.id.includes('overhead');
    });

    const peak = pool.filter(e => {
        // Biceps: Concentration, Spider, Scott, Machine
        if (target === 'biceps') return e.id.includes('conc') || e.id.includes('spider') || e.id.includes('scott') || e.id.includes('21');
        // Triceps: Pushdown, Kickback
        return e.id.includes('pulley') || e.id.includes('rope') || e.id.includes('kickback');
    });

    const selection: Exercise[] = [];

    // 1. Mass Builder (Mid Range)
    if (count >= 1) {
        const pick = mass[Math.floor(Math.random() * mass.length)] || pool[0];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
    }



    // 2. Stretch (Lengthened)
    if (count >= 2) {
        const pick = stretch[Math.floor(Math.random() * stretch.length)] || peak[0] || pool[1];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
    }

    // 3. Peak/Pump (Shortened)
    if (count >= 3) {
        const pick = peak[Math.floor(Math.random() * peak.length)] || pool[2];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
    }

    // 4. Fill Remainder
    while (selection.length < count) {
        const remaining = all.filter(e => e.muscleGroup === 'arms' && !usedIds.includes(e.id));
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
        else break;
    }

    return selection;
};

// Helper: Smart Shoulder Sequencer (Overhead -> Side -> Front/Rear -> Trap/Finisher)
function getSmartShoulderSequence(
    count: number,
    usedIds: string[] = []
): Exercise[] {
    const all = Object.values(EXERCISE_LIBRARY);
    // Find all shoulder exercises suitable for gym (or user equipment)
    // Assuming context handles equipment filtration, here we just pick semantic types
    const pool = all.filter(e => e.muscleGroup === 'shoulders' && !usedIds.includes(e.id));

    const overhead = pool.filter(e => e.id.includes('press') || e.id.includes('desenvolvimento'));
    const side = pool.filter(e => e.id.includes('lateral') || e.id.includes('upright'));
    const rear = pool.filter(e => e.id.includes('reverse') || e.id.includes('face_pull'));
    const front = pool.filter(e => e.id.includes('front'));

    const selection: Exercise[] = [];

    // 1. Heavy Compound / Overhead
    if (count >= 1) {
        const pick = overhead[Math.floor(Math.random() * overhead.length)] || pool[0];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
    }

    // 2. Side Isolation (Width)
    if (count >= 2) {
        const pick = side[Math.floor(Math.random() * side.length)] || pool[1];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
    }

    // 3. Rear Delt (3D Look)
    if (count >= 3) {
        const pick = rear[Math.floor(Math.random() * rear.length)] || pool[2];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
    }

    // 4. Front Delt or More Side/Compound
    if (count >= 4) {
        const pick = front[Math.floor(Math.random() * front.length)] || side[Math.floor(Math.random() * side.length)] || pool[3];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
    }

    // 5. Fill Remainder
    while (selection.length < count) {
        const remaining = all.filter(e => e.muscleGroup === 'shoulders' && !usedIds.includes(e.id));
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        if (pick) { selection.push(pick); usedIds.push(pick.id); }
        else break;
    }

    return selection;
}

// --- DYNAMIC SESSION BUILDER ---

const buildSession = (
    id: string,
    dayLabel: string,
    config: {
        title: string;
        focus: string;
        warmup: string[];
        blocks: Array<{
            group: MuscleGroup;
            sets: number;
            reps: string;
            rest: number;
            stimulus?: ExerciseStimulus;
            mechanic?: ExerciseMechanic;
            forceId?: string; // Explicit override
        }>;
        cooldown: string[];
        duration: number;
        userLevel: TrainingLevel;
        usedExercises: string[]; // Reference to global exclusion list
        availableEquipment?: Equipment[];
        gender?: Gender;
    }
): WorkoutSession => {
    const sessionExercises: WorkoutExercise[] = [];
    const prioritizeTags = config.gender === 'female' ? ['#feminino'] : [];
    const avoidTags = (config.gender === 'female' && config.userLevel === 'beginner') ? ['#lumbar_risk'] : [];

    config.blocks.forEach(block => {
        let exerciseId = block.forceId || getSmartExercise({
            group: block.group,
            maxDifficulty: config.userLevel,
            stimulus: block.stimulus,
            mechanic: block.mechanic,
            exclude: config.usedExercises,
            availableEquipment: config.availableEquipment, // Propagate
            prioritizeTags,
            avoidTags
        });

        // Retry logic: If we hit fail-safe (jumping_jack) but didn't ask for it, try again without exclusions
        if (exerciseId === 'jumping_jack' && block.group !== 'full_body' && block.group !== 'cardio') {
            exerciseId = getSmartExercise({
                group: block.group,
                maxDifficulty: config.userLevel,
                stimulus: block.stimulus,
                mechanic: block.mechanic,
                exclude: [] // RESET exclusions to allow repeats if necessary
            });
        }

        // Add to exclusion list to prevent repeat IN THIS WEEK
        config.usedExercises.push(exerciseId);

        const libEx = EXERCISE_LIBRARY[exerciseId];

        sessionExercises.push({
            exerciseId,
            exerciseName: libEx ? libEx.name : exerciseId,
            sets: Array(block.sets).fill(null).map(() => createSet('working', block.reps, block.rest))
        });
    });

    return {
        id,
        title: config.title,
        dayLabel,
        focus: config.focus,
        warmup: config.warmup,
        cooldown: config.cooldown,
        exercises: sessionExercises,
        estimatedDuration: config.duration,
        completed: false
    };
};

// --- STRATEGIES ---

// 1. FAT LOSS: 60-70% Metabolic, Circuits, Functional+Cardio
// Strategy: High density, short rest, compound movements.
const generateFatLossPlan = (level: TrainingLevel, gender: Gender): WorkoutSession[] => {
    const sessions: WorkoutSession[] = [];
    const usedExercises: string[] = [];

    // Session Template: Metabolic Circuit (Mix of Strength + Cardio)
    const createMetabolicSession = (id: string, title: string, focus: string) => {
        return buildSession(id, 'Dia X', {
            title,
            focus,
            duration: 40,
            userLevel: level,
            usedExercises,
            gender,
            warmup: ['jumping_jack', 'mountain_climber'], // Fixed ID
            cooldown: ['child_pose', 'stretch_hamstring'],
            blocks: [
                // Block 1: The "Meat" (Compound Strength but fast paced)
                { group: 'legs', mechanic: 'compound', sets: 3, reps: '15', rest: 30, stimulus: 'endurance' },
                { group: 'chest', mechanic: 'compound', sets: 3, reps: '15', rest: 30, stimulus: 'endurance' },
                // Block 2: The "Burn" (Functional/Metabolic)
                { group: 'full_body', mechanic: 'compound', sets: 4, reps: '40s', rest: 20, stimulus: 'cardio_respiratory' }, // Burpee/Thruster
                { group: 'core', mechanic: 'compound', sets: 3, reps: '20', rest: 30 }, // Mtn Climber/Plank
                // Block 3: Finisher
                { group: 'cardio', mechanic: 'compound', sets: 1, reps: 'FATIGUE', rest: 0 }
            ]
        });
    };

    // Monday: Full Body Metabolic
    sessions.push({ ...createMetabolicSession(`fl-${Date.now()}-1`, 'Metabolic Fire A', 'Gasto Calórico'), dayLabel: 'Segunda' });

    // Wednesday: HIIT + Core Focus
    sessions.push(buildSession(`fl-${Date.now()}-2`, 'Quarta', {
        title: 'HIIT & Core',
        focus: 'Alta Intensidade',
        duration: 30,
        userLevel: level,
        usedExercises,
        gender,
        warmup: ['run_light', 'shoulder_dislocate'], // Dynamic warmup
        cooldown: ['cat_cow'],
        blocks: [
            { group: 'full_body', mechanic: 'compound', sets: 4, reps: '30s', rest: 15, stimulus: 'cardio_respiratory' }, // Tabata style
            { group: 'legs', mechanic: 'compound', sets: 4, reps: '30s', rest: 15, stimulus: 'cardio_respiratory' }, // Jump focus
            { group: 'core', mechanic: 'isolation', sets: 3, reps: '20', rest: 30 },
            { group: 'core', mechanic: 'isolation', sets: 3, reps: '20', rest: 30 }
        ]
    }));

    // Friday: Endurance Challenge
    sessions.push({ ...createMetabolicSession(`fl-${Date.now()}-3`, 'Metabolic Fire B', 'Resistência Total'), dayLabel: 'Sexta' });

    // Optional Sat
    if (level !== 'beginner') {
        sessions.push(buildSession(`fl-${Date.now()}-4`, 'Sábado', {
            title: 'Cardio Funcional',
            focus: 'Queima Extra',
            duration: 35,
            userLevel: level,
            usedExercises,
            gender,
            warmup: ['run_light'],
            cooldown: ['stretch_quad'],
            blocks: [
                { group: 'cardio', mechanic: 'compound', sets: 5, reps: '1min', rest: 30 }, // Run/Row
                { group: 'full_body', mechanic: 'compound', sets: 3, reps: '15', rest: 45 } // Functional carry/swing
            ]
        }));
    }

    return sessions;
};

// --- HELPER: Volume scaling by level ---
const getVolumeTarget = (level: TrainingLevel, profile?: UserProfile): number => {
    // Advanced + Very Active = High Volume (10-12 exercises)
    if (profile?.activityLevel === 'very_active') {
        return level === 'advanced' ? 11 : 9;
    }

    switch (level) {
        case 'beginner': return 5; // 5-6 range
        case 'intermediate': return 7; // 6-8 range
        case 'advanced': return 9; // 8-10 range
        default: return 6;
    }
};

// 2. MUSCLE GAIN: Expert Splits + Pro Structure (Pyramid)
const generateMusclePlan = (level: TrainingLevel, gender: Gender, profile?: UserProfile): WorkoutSession[] => {
    const sessions: WorkoutSession[] = [];
    const usedExercises: string[] = [];

    // Pass profile to getVolumeTarget to handle 'very_active' logic
    const volumeTarget = getVolumeTarget(level, profile);

    // Split Selector
    const splitTypes = ['synergistic', 'specific', 'ppl'];
    const selectedSplit = splitTypes[Math.floor(Math.random() * splitTypes.length)];

    // Helper to build a "Pro Pyramid" session dynamically
    const createProSession = (
        id: string,
        dayTitle: string,
        focusDesc: string,
        primaryGroup: MuscleGroup,
        secondaryGroup: MuscleGroup | null,
        warmup: string[],
        cooldown: string[],
        armFocus?: 'biceps' | 'triceps' // NEW PARAM
    ) => {
        const blocks: any[] = [];

        // 1. MAIN LIFT (Heavy Compound) - The Foundation
        blocks.push({
            group: primaryGroup,
            mechanic: 'compound',
            sets: 4,
            reps: '6-8',
            rest: 120,
            stimulus: 'strength'
        });

        // 2. SECONDARY (Volume Compound/Machine)
        blocks.push({
            group: primaryGroup,
            mechanic: 'compound',
            sets: 3,
            reps: '8-12',
            rest: 90,
            stimulus: 'hypertrophy'
        });

        // SPECIAL LOGIC: ARM & SHOULDER SEQUENCE OVERRIDE
        let armSequence: any[] = [];
        let shoulderSequence: any[] = [];

        if (secondaryGroup === 'arms' || primaryGroup === 'arms') {
            // ... (Arm logic existing) ...
            let target: 'biceps' | 'triceps' = 'biceps';
            if (armFocus) {
                target = armFocus;
            } else {
                const isBiceps = focusDesc.toLowerCase().includes('biceps') || focusDesc.toLowerCase().includes('pull') || focusDesc.toLowerCase().includes('costas');
                const isTriceps = focusDesc.toLowerCase().includes('tríceps') || focusDesc.toLowerCase().includes('push') || focusDesc.toLowerCase().includes('peito');
                target = isBiceps ? 'biceps' : (isTriceps ? 'triceps' : 'biceps');
            }
            armSequence = getSmartArmSequence(target, 5);
        }

        if (primaryGroup === 'shoulders' || secondaryGroup === 'shoulders') {
            // Need at least 4 shoulder exercises?
            shoulderSequence = getSmartShoulderSequence(4);
        }

        // 3. COMPLEMENTARY / ISOLATION START
        if (secondaryGroup) {
            // ARM COMPLEMENTARY CHECK
            if (secondaryGroup === 'arms' && armSequence.length > 0) {
                blocks.push({
                    group: secondaryGroup,
                    mechanic: 'isolation',
                    sets: 3,
                    reps: '8-12',
                    rest: 90,
                    stimulus: 'hypertrophy',
                    forceId: armSequence[0].id
                });
            }
            // SHOULDER COMPLEMENTARY CHECK (e.g. Push Day with Shoulders secondary)
            else if (secondaryGroup === 'shoulders' && shoulderSequence.length > 0) {
                blocks.push({
                    group: secondaryGroup,
                    mechanic: 'isolation',
                    sets: 3,
                    reps: '10-12',
                    rest: 60,
                    stimulus: 'hypertrophy',
                    forceId: shoulderSequence[0].id // Likely Overhead or Side
                });
            }
            else {
                blocks.push({
                    group: secondaryGroup,
                    mechanic: 'compound',
                    sets: 3,
                    reps: '8-12',
                    rest: 90,
                    stimulus: 'hypertrophy'
                });
            }
        } else {
            // If no secondary grouping (e.g. Leg Day or Shoulder Day), add more Primary Isolation

            // SHOULDER DAY SPECIAL
            if (primaryGroup === 'shoulders' && shoulderSequence.length > 1) {
                // We already added Main Lift (likely Overhead).
                // Now add Side Delt
                blocks.push({
                    group: primaryGroup,
                    mechanic: 'isolation',
                    sets: 4,
                    reps: '12-15',
                    rest: 60,
                    stimulus: 'hypertrophy',
                    forceId: shoulderSequence[1].id // Side
                });
            } else {
                blocks.push({
                    group: primaryGroup,
                    mechanic: 'isolation',
                    sets: 3,
                    reps: '12-15',
                    rest: 60,
                    stimulus: 'hypertrophy'
                });
            }
        }

        // 4. ISOLATION FILLER (Fill remaining volume slots)
        let currentCount = blocks.length;
        const targetForFiller = (level !== 'beginner') ? volumeTarget - 1 : volumeTarget; // Reserve 1 for finisher

        // If we are doing arms, we used index 0 already. Start at 1.
        let armIndex = 1;
        let shoulderIndex = (primaryGroup === 'shoulders' ? 2 : 1); // If Main+Side used, start at 2 (Rear)

        while (currentCount < targetForFiller) {
            const useSecondary = secondaryGroup && currentCount % 2 !== 0;

            if (useSecondary && secondaryGroup === 'arms' && armSequence[armIndex]) {
                blocks.push({
                    group: 'arms',
                    mechanic: 'isolation',
                    sets: 3,
                    reps: '12-15',
                    rest: 60,
                    stimulus: 'hypertrophy',
                    forceId: armSequence[armIndex].id
                });
                armIndex++;
            }
            else if ((useSecondary && secondaryGroup === 'shoulders') || (primaryGroup === 'shoulders')) {
                // Force Shoulder Sequence
                if (shoulderSequence[shoulderIndex]) {
                    blocks.push({
                        group: 'shoulders',
                        mechanic: 'isolation',
                        sets: 3,
                        reps: '12-15',
                        rest: 60,
                        stimulus: 'hypertrophy',
                        forceId: shoulderSequence[shoulderIndex].id
                    });
                    shoulderIndex++;
                } else {
                    // Fallback if we ran out of specific sequence
                    blocks.push({
                        group: 'shoulders',
                        mechanic: 'isolation',
                        sets: 3,
                        reps: '12-15',
                        rest: 60,
                        stimulus: 'hypertrophy'
                    });
                }
            }
            else {
                blocks.push({
                    group: useSecondary ? secondaryGroup : primaryGroup,
                    mechanic: 'isolation',
                    sets: 3,
                    reps: '12-15',
                    rest: 60,
                    stimulus: 'hypertrophy'
                });
            }
            currentCount++;
        }

        // 5. FINISHER (Metabolic/Burnout) - Advanced/Int only or if slot remains
        if (level !== 'beginner' || blocks.length < volumeTarget) {
            const useArmFinisher = secondaryGroup === 'arms' && armSequence[armIndex];
            blocks.push({
                group: secondaryGroup || primaryGroup,
                mechanic: 'isolation',
                sets: 2,
                reps: 'Falha',
                rest: 45,
                stimulus: 'hypertrophy',
                forceId: useArmFinisher ? armSequence[armIndex].id : undefined
            });
        }

        return buildSession(id, dayTitle, {
            title: dayTitle,
            focus: focusDesc,
            duration: 50 + (volumeTarget * 5),
            userLevel: level,
            usedExercises,
            warmup,
            cooldown,
            gender,
            blocks
        });
    };

    // --- APPLY SPLITS USING PRO BUILDER ---

    if (selectedSplit === 'synergistic') {
        const d1 = dayLabel(0);
        sessions.push(createProSession(`mg-syn-${Date.now()}-1`, 'Peito & Tríceps', 'Empurrar (Push)', 'chest', 'arms', ['shoulder_dislocate', 'push_up'], ['stretch_hamstring'], 'triceps'));
        sessions.push({ ...createProSession(`mg-syn-${Date.now()}-2`, 'Costas & Bíceps', 'Puxar (Pull)', 'back', 'arms', ['cat_cow', 'thoracic_rot'], ['child_pose'], 'biceps'), dayLabel: 'Terça' });
        sessions.push({ ...createProSession(`mg-syn-${Date.now()}-3`, 'Pernas & Panturrilha', 'Inferiores', 'legs', null, ['squat_bodyweight', 'hip_opener'], ['pigeon_pose']), dayLabel: 'Quinta' });
        sessions.push({ ...createProSession(`mg-syn-${Date.now()}-4`, 'Ombros & Core', 'Deltóides', 'shoulders', 'core', ['arm_circles'], ['child_pose']), dayLabel: 'Sexta' });
    }
    else if (selectedSplit === 'specific') {
        sessions.push(createProSession(`mg-spec-${Date.now()}-1`, 'Peito & Ombros', 'Push Heavy', 'chest', 'shoulders', ['shoulder_dislocate'], ['stretch_hamstring']));
        sessions.push({ ...createProSession(`mg-spec-${Date.now()}-2`, 'Costas & Tríceps', 'Pull & Push', 'back', 'arms', ['cat_cow'], ['child_pose'], 'triceps') });
        sessions.push({ ...createProSession(`mg-spec-${Date.now()}-3`, 'Posterior & Glúteo', 'Cadeia Posterior', 'legs', null, ['glute_bridge'], ['pigeon_pose']), dayLabel: 'Quinta' });
        // UPDATED: Day 4 now targets Quads & BICEPS to satisfy user request for visibility and focus
        sessions.push({ ...createProSession(`mg-spec-${Date.now()}-4`, 'Quadríceps & Bíceps', 'Anterior & Braços', 'legs', 'arms', ['squat_bodyweight'], ['stretch_quad'], 'biceps'), dayLabel: 'Sexta' });
    }
    else { // PPL
        sessions.push(createProSession(`mg-ppl-${Date.now()}-1`, 'Push (Empurrar)', 'Peito/Ombro/Tri', 'chest', 'shoulders', ['push_up'], ['stretch_hamstring'], 'triceps')); // Implicit triceps
        sessions.push({ ...createProSession(`mg-ppl-${Date.now()}-2`, 'Pull (Puxar)', 'Costas/Bíceps', 'back', 'arms', ['cat_cow'], ['child_pose'], 'biceps'), dayLabel: 'Quarta' });
        sessions.push({ ...createProSession(`mg-ppl-${Date.now()}-3`, 'Legs (Pernas)', 'Inferiores', 'legs', null, ['squat_bodyweight'], ['stretch_quad']), dayLabel: 'Sexta' });
    }

    // Assign Day Labels correctly if not handled by push spread
    const days = ['Segunda', 'Terça', 'Quinta', 'Sexta']; // Standard 4 day spread
    sessions.forEach((s, i) => s.dayLabel = days[i] || 'Extra');

    return sessions;
};

function dayLabel(offset: number) { return 'Segunda'; } // Dummy for first item


// 3. HEALTH: Balanced Mix (Strength + Cardio + Mobility)
// Strategy: Low joint impact, consistency, functional patterns.
const generateHealthPlan = (level: TrainingLevel, gender: Gender): WorkoutSession[] => {
    const sessions: WorkoutSession[] = [];
    const usedExercises: string[] = [];

    // Day 1: Full Body Functional
    sessions.push(buildSession(`hlt-${Date.now()}-1`, 'Segunda', {
        title: 'Funcional & Vitalidade',
        focus: 'Movimento Natural',
        duration: 40,
        userLevel: level,
        usedExercises,
        gender,
        warmup: ['cat_cow', 'thoracic_rot'],
        cooldown: ['child_pose'],
        blocks: [
            { group: 'legs', mechanic: 'compound', sets: 2, reps: '12', rest: 60 }, // Squat/Sit
            { group: 'back', mechanic: 'compound', sets: 2, reps: '12', rest: 60 }, // Pull
            { group: 'shoulders', mechanic: 'compound', sets: 2, reps: '12', rest: 60 }, // Press
            { group: 'core', mechanic: 'isolation', sets: 2, reps: '30s', rest: 45 }  // Stability
        ]
    }));

    // Day 2: Mobility & Steady Cardio
    sessions.push(buildSession(`hlt-${Date.now()}-2`, 'Quarta', {
        title: 'Cardio & Mobilidade',
        focus: 'Saúde Cardiovascular',
        duration: 35,
        userLevel: level,
        usedExercises,
        gender,
        warmup: ['stretch_quad', 'stretch_hamstring'],
        cooldown: ['pigeon_pose'],
        blocks: [
            { group: 'cardio', mechanic: 'compound', sets: 1, reps: '20min', rest: 0, stimulus: 'cardio_respiratory' }, // Steady state
            { group: 'back', mechanic: 'isolation', sets: 3, reps: '45s', rest: 30 }, // Mobility flow
            { group: 'legs', mechanic: 'isolation', sets: 3, reps: '45s', rest: 30 }  // Stretching
        ]
    }));

    // Day 3: Core & Stability
    sessions.push(buildSession(`hlt-${Date.now()}-3`, 'Sexta', {
        title: 'Core & Postura',
        focus: 'Fortalecimento Central',
        duration: 30,
        userLevel: level,
        usedExercises,
        gender,
        warmup: ['bird_dog', 'dead_bug'],
        cooldown: ['child_pose'],
        blocks: [
            { group: 'core', mechanic: 'isolation', sets: 3, reps: '15', rest: 45 },
            { group: 'back', mechanic: 'isolation', sets: 3, reps: '15', rest: 45 }, // Face pull/rev fly
            { group: 'legs', mechanic: 'compound', sets: 2, reps: '15', rest: 45 }, // Bodyweight lunge
            { group: 'cardio', mechanic: 'compound', sets: 1, reps: '5min', rest: 0 } // Walk
        ]
    }));

    return sessions;
};

// 4. HOME: Adaptable Splits based on Gear
const generateHomePlan = (level: TrainingLevel, equipment: Equipment[], gender: Gender): WorkoutSession[] => {
    const sessions: WorkoutSession[] = [];
    const usedExercises: string[] = [];

    // Default to Full Body for simplistic home routine unless Advanced
    // But let's offer variations.

    // STRATEGY: 
    // Beginner/Int -> Full Body A/B (3-4 days)
    // Advanced/High Equip -> Upper/Lower (4 days)

    const isAdvanced = level === 'advanced';
    const hasHeavyGear = equipment.includes('home_dumbbells') || equipment.includes('kettlebell');


    const isCasaMulher = gender === 'female';

    if (isCasaMulher && !isAdvanced) {
        // "Casa Mulher" Strategy: 15-30min, Glute/Legs Focus, Posture, Low Impact option
        const duration = 25; // Target shorter efficient sessions

        const createFemHomeSession = (id: string, label: string, focus: 'A' | 'B') => buildSession(id, label, {
            title: `Casa Mulher ${focus}`,
            focus: focus === 'A' ? 'Glúteo & Pernas' : 'Postura & Core',
            duration,
            userLevel: level,
            usedExercises,
            gender,
            availableEquipment: equipment,
            warmup: ['hip_opener', 'cat_cow'], // Pelvic/Hip focus
            cooldown: ['pigeon_pose', 'child_pose'],
            blocks: focus === 'A' ? [
                { group: 'legs', mechanic: 'compound', sets: 3, reps: '15', rest: 45, forceId: 'sumo_squat' },
                { group: 'legs', mechanic: 'isolation', sets: 3, reps: '20', rest: 30, forceId: 'glute_kickback' }, // or hip thrust if bench
                { group: 'legs', mechanic: 'isolation', sets: 3, reps: '20', rest: 30, forceId: 'clam_shell' },
                { group: 'cardio', mechanic: 'compound', sets: 1, reps: '10min', rest: 0 } // Low impact walk/step
            ] : [
                { group: 'back', mechanic: 'compound', sets: 3, reps: '15', rest: 45 }, // Posture
                { group: 'shoulders', mechanic: 'isolation', sets: 3, reps: '15', rest: 30, forceId: 'face_pull' }, // Posture
                { group: 'core', mechanic: 'isolation', sets: 3, reps: '20', rest: 30, forceId: 'swiss_ball_crunch' }, // Core
                { group: 'full_body', mechanic: 'compound', sets: 1, reps: '5min', rest: 0 }
            ]
        });

        sessions.push(createFemHomeSession(`home-fem-${Date.now()}-1`, 'Segunda', 'A'));
        sessions.push(createFemHomeSession(`home-fem-${Date.now()}-2`, 'Quarta', 'B'));
        sessions.push(createFemHomeSession(`home-fem-${Date.now()}-3`, 'Sexta', 'A'));

    } else if (isAdvanced && hasHeavyGear) {
        // UPPER / LOWER SPLIT (4 Days)
        const upper = (id: string, label: string) => buildSession(id, label, {
            title: 'Superiores',
            focus: 'Força & Hipertrofia',
            duration: 45,
            userLevel: level,
            usedExercises,
            gender,
            availableEquipment: equipment,
            warmup: ['arm_circles', 'push_up_pike'], // Dynamic
            cooldown: ['child_pose'],
            blocks: [
                { group: 'chest', mechanic: 'compound', sets: 4, reps: '12-15', rest: 60 }, // Push
                { group: 'back', mechanic: 'compound', sets: 4, reps: '12-15', rest: 60 }, // Pull
                { group: 'shoulders', mechanic: 'compound', sets: 3, reps: '15', rest: 45 },// Overhead
                { group: 'arms', mechanic: 'isolation', sets: 3, reps: '15-20', rest: 45 }  // Pump
            ]
        });

        const lower = (id: string, label: string) => buildSession(id, label, {
            title: 'Inferiores',
            focus: 'Pernas & Core',
            duration: 45,
            userLevel: level,
            usedExercises,
            gender,
            availableEquipment: equipment,
            warmup: ['hip_opener', 'squat_bodyweight'],
            cooldown: ['pigeon_pose'],
            blocks: [
                { group: 'legs', mechanic: 'compound', sets: 4, reps: '15-20', rest: 60 }, // Squat pattern
                { group: 'legs', mechanic: 'compound', sets: 3, reps: '12-15', rest: 60 }, // Lunge/Hinge
                { group: 'legs', mechanic: 'isolation', sets: 3, reps: '20', rest: 45 },    // Glute/Calf
                { group: 'core', mechanic: 'isolation', sets: 3, reps: '30s', rest: 30 }
            ]
        });

        sessions.push(upper(`home-ul-${Date.now()}-1`, 'Segunda'));
        sessions.push(lower(`home-ul-${Date.now()}-2`, 'Terça'));
        sessions.push(upper(`home-ul-${Date.now()}-3`, 'Quinta'));
        sessions.push(lower(`home-ul-${Date.now()}-4`, 'Sexta'));

    } else {
        // FULL BODY CIRCUIT (3 Days) - Best for Bodyweight/Light weights
        // Focus on density and frequency
        const createFullBody = (id: string, label: string, focus: 'A' | 'B') => buildSession(id, label, {
            title: `Full Body ${focus}`,
            focus: 'Resistência & Tônus',
            duration: 40,
            userLevel: level,
            usedExercises,
            gender,
            availableEquipment: equipment,
            warmup: ['jumping_jack', 'arm_circles'],
            cooldown: ['child_pose'],
            blocks: focus === 'A' ? [
                { group: 'legs', mechanic: 'compound', sets: 3, reps: '20', rest: 30 }, // Squat
                { group: 'chest', mechanic: 'compound', sets: 3, reps: '15', rest: 30 }, // Push
                { group: 'back', mechanic: 'compound', sets: 3, reps: '15', rest: 30 }, // Pull
                { group: 'core', mechanic: 'isolation', sets: 3, reps: '30s', rest: 30 }
            ] : [
                { group: 'legs', mechanic: 'compound', sets: 3, reps: '15', rest: 30 }, // Lunge/Hinge
                { group: 'shoulders', mechanic: 'compound', sets: 3, reps: '15', rest: 30 }, // Vertical Push
                { group: 'arms', mechanic: 'isolation', sets: 3, reps: '15', rest: 30 },   // Arms
                { group: 'cardio', mechanic: 'compound', sets: 1, reps: '5min', rest: 0 }  // Finisher
            ]
        });

        sessions.push(createFullBody(`home-fb-${Date.now()}-1`, 'Segunda', 'A'));
        sessions.push(createFullBody(`home-fb-${Date.now()}-2`, 'Quarta', 'B'));
        sessions.push(createFullBody(`home-fb-${Date.now()}-3`, 'Sexta', 'A'));
    }

    return sessions;
};

// 5. STRENGTH / FORCE MAX: Low Reps, High Rest, Compound Focus
const generateStrengthPlan = (level: TrainingLevel, gender: Gender): WorkoutSession[] => {
    const sessions: WorkoutSession[] = [];
    const usedExercises: string[] = [];

    // Focus: Squat, Bench, Deadlift, OHP
    // Structure: Upper/Lower or Full Body based on level
    // Reps: 3-5 for main, 6-10 for accessories

    const createStrengthSession = (id: string, title: string, focus: string, mainGroup: MuscleGroup, mainLiftId: string) => {
        return buildSession(id, 'Dia X', {
            title,
            focus,
            duration: 50,
            userLevel: level,
            usedExercises,
            gender,
            warmup: ['arm_circles', 'hip_opener', 'mobility_squat'], // Generic dynamic
            cooldown: ['child_pose', 'stretch_hamstring'],
            blocks: [
                // MAIN LIFT: Heavy, Low Reps, Long Rest
                { group: mainGroup, mechanic: 'compound', sets: 5, reps: '5', rest: 180, stimulus: 'strength', forceId: mainLiftId },
                // SUPPLEMENTARY LIFT: Moderate Reps
                { group: mainGroup === 'chest' ? 'shoulders' : (mainGroup === 'legs' ? 'back' : 'chest'), mechanic: 'compound', sets: 3, reps: '8-10', rest: 90, stimulus: 'strength' },
                // ACCESSORY 1
                { group: mainGroup, mechanic: 'isolation', sets: 3, reps: '10-12', rest: 60, stimulus: 'hypertrophy' },
                // CORE / STABILITY
                { group: 'core', mechanic: 'isolation', sets: 3, reps: '15', rest: 60 }
            ]
        });
    };

    if (level === 'advanced') {
        // 4 Day Split
        sessions.push({ ...createStrengthSession(`str-${Date.now()}-1`, 'Força: Empurrar', 'Supino Focus', 'chest', 'bench_press_barbell'), dayLabel: 'Segunda' });
        sessions.push({ ...createStrengthSession(`str-${Date.now()}-2`, 'Força: Agachamento', 'Pernas Base', 'legs', 'squat_barbell'), dayLabel: 'Terça' });
        sessions.push({ ...createStrengthSession(`str-${Date.now()}-3`, 'Força: Puxar & Ombros', 'Costas & OHP', 'shoulders', 'overhead_press_barbell'), dayLabel: 'Quinta' });
        sessions.push({ ...createStrengthSession(`str-${Date.now()}-4`, 'Força: Levantamento', 'Cadeia Posterior', 'back', 'deadlift_barbell'), dayLabel: 'Sexta' });
    } else {
        // 3 Day Full Body (Starting Strength style)
        sessions.push({ ...createStrengthSession(`str-${Date.now()}-1`, 'Força A', 'Agachamento & Empurrar', 'legs', 'squat_barbell'), dayLabel: 'Segunda' });
        sessions.push({ ...createStrengthSession(`str-${Date.now()}-2`, 'Força B', 'Levantamento & Puxar', 'back', 'deadlift_barbell'), dayLabel: 'Quarta' });
        sessions.push({ ...createStrengthSession(`str-${Date.now()}-3`, 'Força C', 'Full Body Power', 'chest', 'bench_press_barbell'), dayLabel: 'Sexta' });
    }

    return sessions;
};

// 6. ATHLETIC / PERFORMANCE: Power, Functional, Conditioning
const generateAthleticPlan = (level: TrainingLevel, gender: Gender): WorkoutSession[] => {
    const sessions: WorkoutSession[] = [];
    const usedExercises: string[] = [];

    // Focus: Explosive movements, Supersets, Functional Cardio
    const createAthleticSession = (id: string, day: string, title: string) => {
        return buildSession(id, day, {
            title,
            focus: 'Potência & Agilidade',
            duration: 45,
            userLevel: level,
            usedExercises,
            gender,
            warmup: ['jumping_jack', 'mountain_climber', 'arm_circles'],
            cooldown: ['stretch_quad', 'pigeon_pose'],
            blocks: [
                // POWER: Plyometric or Explosive
                { group: 'legs', mechanic: 'compound', sets: 4, reps: '6-8', rest: 90, stimulus: 'power' }, // Jump Squats etc
                // STRENGTH SUPERSET
                { group: 'chest', mechanic: 'compound', sets: 3, reps: '10', rest: 45 },
                { group: 'back', mechanic: 'compound', sets: 3, reps: '10', rest: 90 }, // Superset rest
                // FUNCTIONAL / CORE
                { group: 'core', mechanic: 'compound', sets: 3, reps: '15', rest: 45 },
                // CONDITIONING FINISHER
                { group: 'cardio', mechanic: 'compound', sets: 1, reps: '5min', rest: 0 }
            ]
        });
    };

    sessions.push(createAthleticSession(`ath-${Date.now()}-1`, 'Segunda', 'Explosão & Força'));
    sessions.push(createAthleticSession(`ath-${Date.now()}-2`, 'Quarta', 'Agilidade & Core'));
    sessions.push(createAthleticSession(`ath-${Date.now()}-3`, 'Sexta', 'Metabólico & Potência'));

    return sessions;
};

// 7. LONGEVITY / ACTIVE AGING: Balanced, Mobility, consistency
const generateLongevityPlan = (level: TrainingLevel, gender: Gender): WorkoutSession[] => {
    // Reusing health plan structure but ensuring lower intensity if needed or just balanced
    // Health plan is already "Vitality" focused
    return generateHealthPlan(level, gender);
};

// --- MAIN GENERATOR ---

export const generateWeeklyPlan = (profile: UserProfile): WeeklyPlan => {
    // Determine level: Explicit > Inferred from Activity > Default
    let level: TrainingLevel = profile.trainingLevel || 'beginner';
    if (!profile.trainingLevel) {
        if (profile.activityLevel === 'moderately_active') level = 'intermediate';
        if (profile.activityLevel === 'very_active') level = 'advanced';
    }

    const goal = profile.goal;
    const mode = profile.workoutMode || 'gym';
    let sessions: WorkoutSession[] = [];
    let planName = '';

    if (mode === 'home') {
        // Infer equipment if not set (Safe Default: Bodyweight)
        const equipment = profile.homeEquipment && profile.homeEquipment.length > 0
            ? profile.homeEquipment
            : ['bodyweight_only', 'home_dumbbells'] as Equipment[]; // Default to basic if home selected

        sessions = generateHomePlan(level, equipment, profile.gender);
        planName = 'Treino em Casa (Adaptável)';

    } else if (goal === 'lose_weight' || goal === 'definition') {
        sessions = generateFatLossPlan(level, profile.gender);
        planName = goal === 'definition' ? 'Definição & Tônus' : 'Queima Inteligente';

    } else if ((profile.goal as any) === 'hypertrophy' || (profile.goal as string) === 'gain_muscle') {
        sessions = generateMusclePlan(level, profile.gender, profile);
        planName = 'Hipertrofia Avançada';

    } else if (goal === 'force_max') {
        sessions = generateStrengthPlan(level, profile.gender);
        planName = 'Força Máxima (Powerlifting)';

    } else if (goal === 'athletic') {
        sessions = generateAthleticPlan(level, profile.gender);
        planName = 'Performance Atlética';

    } else if (goal === 'glute_growth') {
        sessions = generateMusclePlan(level, profile.gender, profile);
        planName = 'Glúteos & Pernas (Foco Total)';

    } else if (goal === 'force_female') {
        sessions = generateMusclePlan(level, profile.gender, profile);
        planName = 'Força Funcional Feminina';

    } else if (goal === 'maintain' || goal === 'longevity') {
        sessions = generateLongevityPlan(level, profile.gender);
        planName = 'Longevidade & Vitalidade';

    } else {
        // Fallback: Health / Post Partum
        sessions = generateHealthPlan(level, profile.gender);
        if (goal === 'post_partum') planName = 'Recuperação Pós-Parto';
        else if (goal === 'health_female') planName = 'Saúde & Ciclo Feminino';
        else planName = 'Vitalidade 360°';
    }

    return {
        id: `plan-${goal}-${Date.now()}`,
        name: planName,
        level,
        goal: getGoalLabel(goal),
        sessions
    };
};

const getGoalLabel = (goal: string): string => {
    const labels: Record<string, string> = {
        'lose_weight': 'Queima de Gordura',
        'gain_muscle': 'Hipertrofia Avançada',
        'force_max': 'Força Máxima',
        'athletic': 'Performance Atlética',
        'longevity': 'Longevidade Ativa',
        'maintain': 'Manutenção',
        'definition': 'Definição Muscular',
        'glute_growth': 'Foco em Glúteos',
        'health_female': 'Saúde da Mulher',
        'force_female': 'Força Funcional',
        'post_partum': 'Pós-Parto'
    };
    return labels[goal] || 'Geral';
};
