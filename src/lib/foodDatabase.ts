import { MealItem } from '../types/diet';

export const FOOD_DATABASE: Record<string, MealItem[]> = {
    // --- PROTEINS (40+ items) ---
    proteins: [
        // Poultry
        { id: 'p_chk_breast_grill', name: 'Peito de Frango Grelhado', portion: '1 filé médio (120g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'low_fat', 'lunch_dinner'], calories: 195, macros: { protein: 36, carbs: 0, fat: 4 }, approxPrice: 'medium', prepTime: 15, prepMethod: 'Grelhado com ervas' },
        { id: 'p_chk_shred', name: 'Frango Desfiado', portion: '4 colheres sopa (100g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'low_fat', 'lunch_dinner', 'quick_prep'], calories: 165, macros: { protein: 31, carbs: 0, fat: 3.5 }, approxPrice: 'medium', prepTime: 20, prepMethod: 'Cozido e desfiado' },
        { id: 'p_chk_drum', name: 'Coxa de Frango Assada', portion: '2 unidades', category: 'protein', exchangeGroup: 'poultry_fat', tags: ['high_protein', 'lunch_dinner', 'cheap'], calories: 250, macros: { protein: 28, carbs: 0, fat: 14 }, approxPrice: 'low', prepTime: 40, prepMethod: 'Assado no forno' },
        { id: 'p_chk_cube', name: 'Cubos de Frango Acebolado', portion: '1 escumadeira (120g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'lunch_dinner'], calories: 210, macros: { protein: 34, carbs: 4, fat: 6 }, approxPrice: 'medium', prepTime: 20, prepMethod: 'Refogado' },

        // Red Meat
        { id: 'p_beef_lean_ground', name: 'Patinho Moído', portion: '4 colheres sopa (100g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'lunch_dinner'], calories: 220, macros: { protein: 32, carbs: 0, fat: 9 }, approxPrice: 'medium', prepTime: 15, prepMethod: 'Refogado com temperos' },
        { id: 'p_beef_steak', name: 'Bife de Coxão Mole', portion: '1 bife médio (100g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'lunch_dinner'], calories: 230, macros: { protein: 30, carbs: 0, fat: 11 }, approxPrice: 'medium', prepTime: 10, prepMethod: 'Grelhado' },
        { id: 'p_beef_roast', name: 'Carne de Panela com Legumes', portion: '1 concha cheia', category: 'protein', exchangeGroup: 'meat_stew', tags: ['high_protein', 'lunch_dinner', 'comfort', 'rich_iron'], calories: 280, macros: { protein: 28, carbs: 8, fat: 14 }, approxPrice: 'medium', prepTime: 45, prepMethod: 'Panela de pressão' },
        { id: 'p_liver', name: 'Bife de Fígado', portion: '1 bife pequeno (100g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'lunch_dinner', 'cheap', 'rich_iron', 'cycle_folicular'], calories: 175, macros: { protein: 26, carbs: 5, fat: 5 }, approxPrice: 'low', prepTime: 15, prepMethod: 'Acebolado' },

        // Fish
        { id: 'p_fish_tilapia', name: 'Filé de Tilápia', portion: '1 filé grande (120g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'low_fat', 'lunch_dinner', 'quick_prep'], calories: 110, macros: { protein: 23, carbs: 0, fat: 2 }, approxPrice: 'medium', prepTime: 10, prepMethod: 'Grelhado com limão' },
        { id: 'p_salmon', name: 'Salmão Assado', portion: '1 filé pequeno (100g)', category: 'protein', exchangeGroup: 'fatty_fish', tags: ['high_protein', 'lunch_dinner', 'premium', 'health'], calories: 206, macros: { protein: 22, carbs: 0, fat: 13 }, approxPrice: 'high', prepTime: 20, prepMethod: 'Assado com azeite' },
        { id: 'p_tuna_can', name: 'Atum em Água', portion: '1 lata (120g)', category: 'protein', exchangeGroup: 'lean_meat', tags: ['high_protein', 'low_fat', 'no_cook', 'quick_prep', 'lunch_dinner', 'snack'], calories: 130, macros: { protein: 30, carbs: 0, fat: 1 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Drenado' },
        { id: 'p_sardine', name: 'Sardinha (Lata)', portion: '1 lata', category: 'protein', exchangeGroup: 'fatty_fish', tags: ['high_protein', 'lunch_dinner', 'cheap', 'no_cook', 'rich_calcium', 'rich_iron', 'anti_inflammatory'], calories: 180, macros: { protein: 20, carbs: 0, fat: 10 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Drenado' },

        // Eggs
        { id: 'p_egg_boiled', name: 'Ovos Cozidos', portion: '2 unidades', category: 'protein', exchangeGroup: 'eggs', tags: ['vegetarian', 'high_protein', 'cheap', 'quick_prep', 'breakfast', 'snack', 'lunch_dinner'], calories: 140, macros: { protein: 12, carbs: 1, fat: 10 }, approxPrice: 'low', prepTime: 10, prepMethod: 'Cozido por 7 min' },
        { id: 'p_egg_scrambled', name: 'Ovos Mexidos Cremosos', portion: '2 unidades', category: 'protein', exchangeGroup: 'eggs', tags: ['vegetarian', 'high_protein', 'cheap', 'quick_prep', 'breakfast', 'lunch_dinner'], calories: 160, macros: { protein: 12, carbs: 1, fat: 12 }, approxPrice: 'low', prepTime: 5, prepMethod: 'Mexido na frigideira' },
        { id: 'p_omelet', name: 'Omelete de Claras', portion: '4 claras + 1 ovo', category: 'protein', exchangeGroup: 'eggs', tags: ['vegetarian', 'high_protein', 'low_fat', 'breakfast', 'lunch_dinner'], calories: 150, macros: { protein: 20, carbs: 1, fat: 5 }, approxPrice: 'medium', prepTime: 10, prepMethod: 'Frigideira antiaderente' },

        // Plant Based
        { id: 'p_tofu_grill', name: 'Tofu Grelhado', portion: '2 fatias grossas (120g)', category: 'protein', exchangeGroup: 'plant_protein', tags: ['vegan', 'vegetarian', 'gluten_free', 'lunch_dinner'], calories: 100, macros: { protein: 12, carbs: 3, fat: 6 }, approxPrice: 'medium', prepTime: 10, prepMethod: 'Grelhado com shoyu' },
        { id: 'p_lentils', name: 'Lentilha Cozida', portion: '1 concha cheia (140g)', category: 'protein', exchangeGroup: 'plant_protein', tags: ['vegan', 'vegetarian', 'cheap', 'lunch_dinner', 'rich_iron'], calories: 160, macros: { protein: 12, carbs: 28, fat: 0.5 }, approxPrice: 'low', prepTime: 25, prepMethod: 'Cozida com louro' },
        { id: 'p_chickpeas', name: 'Grão de Bico', portion: '4 colheres sopa (100g)', category: 'protein', exchangeGroup: 'plant_protein', tags: ['vegan', 'vegetarian', 'lunch_dinner', 'rich_iron', 'cycle_luteal'], calories: 164, macros: { protein: 9, carbs: 27, fat: 2.6 }, approxPrice: 'low', prepTime: 30, prepMethod: 'Cozido' },
        { id: 'p_soy_meat', name: 'Carne de Soja (PTS)', portion: '1 xícara hidratada', category: 'protein', exchangeGroup: 'plant_protein', tags: ['vegan', 'cheap', 'lunch_dinner', 'high_protein'], calories: 150, macros: { protein: 25, carbs: 10, fat: 1 }, approxPrice: 'low', prepTime: 20, prepMethod: 'Hidratada e refogada' },

        // Dairy & Supplements
        { id: 'p_whey', name: 'Whey Protein', portion: '1 scoop (30g)', category: 'protein', exchangeGroup: 'supplement', tags: ['vegetarian', 'high_protein', 'quick_prep', 'no_cook', 'snack', 'post_workout'], calories: 120, macros: { protein: 24, carbs: 3, fat: 1 }, approxPrice: 'high', prepTime: 1, prepMethod: 'Misturado com água' },
        { id: 'p_yogurt_greek', name: 'Iogurte Grego Natural', portion: '1 pote (100g)', category: 'protein', exchangeGroup: 'dairy_protein', tags: ['vegetarian', 'high_protein', 'no_cook', 'breakfast', 'snack', 'rich_calcium'], calories: 60, macros: { protein: 10, carbs: 4, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Pronto para comer' },
        { id: 'p_cottage', name: 'Queijo Cottage', portion: '2 colheres sopa', category: 'protein', exchangeGroup: 'dairy_protein', tags: ['vegetarian', 'high_protein', 'no_cook', 'breakfast', 'snack'], calories: 50, macros: { protein: 8, carbs: 2, fat: 1 }, approxPrice: 'high', prepTime: 0, prepMethod: 'Pronto para comer' }
    ],

    // --- CARBS (40+ items) ---
    carbs: [
        // Rice & Grains
        { id: 'c_rice_white', name: 'Arroz Branco', portion: '4 colheres sopa (100g)', category: 'carb', exchangeGroup: 'rice_pasta', tags: ['vegan', 'gluten_free', 'cheap', 'lunch_dinner', 'post_workout'], calories: 130, macros: { protein: 2, carbs: 28, fat: 0 }, approxPrice: 'low', prepTime: 20, prepMethod: 'Cozido soltinho' },
        { id: 'c_rice_brown', name: 'Arroz Integral', portion: '4 colheres sopa (100g)', category: 'carb', exchangeGroup: 'rice_pasta', tags: ['vegan', 'gluten_free', 'cheap', 'lunch_dinner', 'health'], calories: 110, macros: { protein: 3, carbs: 23, fat: 1 }, approxPrice: 'low', prepTime: 35, prepMethod: 'Cozido' },
        { id: 'c_quinoa', name: 'Quinoa Cozida', portion: '4 colheres sopa (100g)', category: 'carb', exchangeGroup: 'rice_pasta', tags: ['vegan', 'gluten_free', 'health', 'lunch_dinner', 'premium'], calories: 120, macros: { protein: 4, carbs: 21, fat: 2 }, approxPrice: 'high', prepTime: 15, prepMethod: 'Cozida' },

        // Pasta
        { id: 'c_pasta', name: 'Macarrão Tipo Espaguete', portion: '1 escumadeira (100g)', category: 'carb', exchangeGroup: 'rice_pasta', tags: ['vegan', 'cheap', 'lunch_dinner'], calories: 140, macros: { protein: 5, carbs: 30, fat: 1 }, approxPrice: 'low', prepTime: 10, prepMethod: 'Al dente' },
        { id: 'c_pasta_whole', name: 'Macarrão Integral', portion: '1 escumadeira (100g)', category: 'carb', exchangeGroup: 'rice_pasta', tags: ['vegan', 'health', 'lunch_dinner'], calories: 124, macros: { protein: 5, carbs: 26, fat: 1 }, approxPrice: 'low', prepTime: 12, prepMethod: 'Al dente' },

        // Tubers
        { id: 'c_sweet_potato', name: 'Batata Doce Cozida', portion: '1 unidade média (150g)', category: 'carb', exchangeGroup: 'tuber', tags: ['vegan', 'gluten_free', 'cheap', 'lunch_dinner', 'pre_workout'], calories: 130, macros: { protein: 2, carbs: 30, fat: 0 }, approxPrice: 'low', prepTime: 25, prepMethod: 'Cozida com casca' },
        { id: 'c_potato_puree', name: 'Purê de Batata Inglesa', portion: '3 colheres sopa (150g)', category: 'carb', exchangeGroup: 'tuber', tags: ['vegetarian', 'gluten_free', 'cheap', 'lunch_dinner'], calories: 150, macros: { protein: 3, carbs: 25, fat: 4 }, approxPrice: 'low', prepTime: 30, prepMethod: 'Amassada com pouco leite' },
        { id: 'c_cassava', name: 'Mandioca Cozida', portion: '2 pedaços médios (100g)', category: 'carb', exchangeGroup: 'tuber', tags: ['vegan', 'gluten_free', 'cheap', 'lunch_dinner'], calories: 160, macros: { protein: 1, carbs: 38, fat: 0 }, approxPrice: 'low', prepTime: 30, prepMethod: 'Cozida' },

        // Breakfast Carbs
        { id: 'c_oats', name: 'Aveia em Flocos', portion: '3 colheres sopa (30g)', category: 'carb', exchangeGroup: 'grain', tags: ['vegan', 'cheap', 'breakfast', 'pre_workout'], calories: 115, macros: { protein: 4, carbs: 17, fat: 2 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Cru / Mingau' },
        { id: 'c_bread_whole', name: 'Pão Integral', portion: '2 fatias', category: 'carb', exchangeGroup: 'bread', tags: ['vegan', 'quick_prep', 'breakfast', 'snack'], calories: 120, macros: { protein: 6, carbs: 22, fat: 1 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Torrado ou natural' },
        { id: 'c_bread_french', name: 'Pão Francês', portion: '1 unidade', category: 'carb', exchangeGroup: 'bread', tags: ['vegan', 'cheap', 'breakfast'], calories: 135, macros: { protein: 4, carbs: 28, fat: 1 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Fresco' },
        { id: 'c_tapioca', name: 'Tapioca', portion: '1 disco médio (60g de goma)', category: 'carb', exchangeGroup: 'flour', tags: ['vegan', 'gluten_free', 'quick_prep', 'breakfast', 'pre_workout'], calories: 140, macros: { protein: 0, carbs: 36, fat: 0 }, approxPrice: 'low', prepTime: 5, prepMethod: 'Frigideira' },
        { id: 'c_cuscus', name: 'Cuscuz de Milho', portion: '1 fatia média', category: 'carb', exchangeGroup: 'flour', tags: ['vegan', 'gluten_free', 'cheap', 'breakfast'], calories: 110, macros: { protein: 2, carbs: 23, fat: 0 }, approxPrice: 'low', prepTime: 10, prepMethod: 'Vapor' },

        // Fruits (High Carb)
        { id: 'c_banana', name: 'Banana Prata', portion: '1 unidade média', category: 'carb', exchangeGroup: 'fruit_carb', tags: ['vegan', 'gluten_free', 'cheap', 'no_cook', 'snack', 'pre_workout'], calories: 90, macros: { protein: 1, carbs: 23, fat: 0 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Natural' },
        { id: 'c_grapes', name: 'Uvas', portion: '1 cacho pequeno (100g)', category: 'carb', exchangeGroup: 'fruit_carb', tags: ['vegan', 'snack'], calories: 70, macros: { protein: 0, carbs: 18, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Natural' },

        // Beans
        { id: 'c_beans_black', name: 'Feijão Preto', portion: '1 concha (100g)', category: 'carb', exchangeGroup: 'beans', tags: ['vegan', 'gluten_free', 'cheap', 'lunch_dinner', 'rich_iron'], calories: 77, macros: { protein: 5, carbs: 14, fat: 0.5 }, approxPrice: 'low', prepTime: 40, prepMethod: 'Cozido' },
        { id: 'c_beans_carioca', name: 'Feijão Carioca', portion: '1 concha (100g)', category: 'carb', exchangeGroup: 'beans', tags: ['vegan', 'gluten_free', 'cheap', 'lunch_dinner'], calories: 76, macros: { protein: 5, carbs: 14, fat: 0.5 }, approxPrice: 'low', prepTime: 40, prepMethod: 'Cozido' },
    ],

    // --- FATS (20+ items) ---
    fats: [
        { id: 'f_olive_oil', name: 'Azeite de Oliva', portion: '1 colher sobremesa (10ml)', category: 'fat', exchangeGroup: 'oil', tags: ['vegan', 'premium', 'lunch_dinner'], calories: 90, macros: { protein: 0, carbs: 0, fat: 10 }, approxPrice: 'high', prepTime: 0, prepMethod: 'Cru' },
        { id: 'f_avocado', name: 'Abacate', portion: '2 colheres sopa (60g)', category: 'fat', exchangeGroup: 'fruit_fat', tags: ['vegan', 'gluten_free', 'breakfast', 'snack'], calories: 96, macros: { protein: 1, carbs: 5, fat: 9 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Amassado ou fatiado' },
        { id: 'f_nuts', name: 'Castanha do Pará', portion: '2 unidades', category: 'fat', exchangeGroup: 'nuts', tags: ['vegan', 'gluten_free', 'premium', 'snack'], calories: 52, macros: { protein: 1, carbs: 1, fat: 5 }, approxPrice: 'high', prepTime: 0, prepMethod: 'Natural' },
        { id: 'f_walnuts', name: 'Nozes', portion: '3 metades', category: 'fat', exchangeGroup: 'nuts', tags: ['vegan', 'premium', 'snack'], calories: 60, macros: { protein: 2, carbs: 2, fat: 6 }, approxPrice: 'high', prepTime: 0, prepMethod: 'Natural' },
        { id: 'f_pb', name: 'Pasta de Amendoim', portion: '1 colher sopa (15g)', category: 'fat', exchangeGroup: 'nuts', tags: ['vegan', 'cheap', 'breakfast', 'snack'], calories: 90, macros: { protein: 4, carbs: 3, fat: 8 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Pasta' },
        { id: 'f_seeds', name: 'Sementes de Chia', portion: '1 colher sopa', category: 'fat', exchangeGroup: 'seeds', tags: ['vegan', 'health', 'snack', 'rich_calcium', 'rich_iron', 'anti_inflammatory'], calories: 60, macros: { protein: 2, carbs: 5, fat: 4 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Adicionado' },
        { id: 'f_choc_dark', name: 'Chocolate 70%', portion: '2 quadrados (20g)', category: 'fat', exchangeGroup: 'treat', tags: ['vegan', 'snack', 'cycle_luteal', 'anti_inflammatory'], calories: 120, macros: { protein: 1, carbs: 7, fat: 8 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Natural' },
        { id: 'f_butter', name: 'Manteiga', portion: '1 ponta de faca (5g)', category: 'fat', exchangeGroup: 'saturated', tags: ['vegetarian', 'breakfast'], calories: 36, macros: { protein: 0, carbs: 0, fat: 4 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Espalhado' },
    ],

    // --- VEGETABLES (40+ items) ---
    vegs: [
        { id: 'v_mix_leaves', name: 'Mix de Folhas', portion: 'À vontade', category: 'veg', exchangeGroup: 'leaves', tags: ['vegan', 'cheap', 'no_cook', 'lunch_dinner'], calories: 15, macros: { protein: 1, carbs: 2, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Lavado' },
        { id: 'v_lettuce', name: 'Alface Americana', portion: 'À vontade', category: 'veg', exchangeGroup: 'leaves', tags: ['vegan', 'cheap', 'no_cook', 'lunch_dinner'], calories: 10, macros: { protein: 1, carbs: 2, fat: 0 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Lavado' },
        { id: 'v_arugula', name: 'Rúcula', portion: '1 maço pequeno', category: 'veg', exchangeGroup: 'leaves', tags: ['vegan', 'health', 'lunch_dinner'], calories: 15, macros: { protein: 1, carbs: 2, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Lavado' },
        { id: 'v_kale', name: 'Couve Refogada', portion: '1 pires', category: 'veg', exchangeGroup: 'green_cooked', tags: ['vegan', 'cheap', 'lunch_dinner', 'health', 'rich_calcium', 'rich_iron'], calories: 40, macros: { protein: 2, carbs: 5, fat: 2 }, approxPrice: 'low', prepTime: 10, prepMethod: 'Refogado com alho' },
        { id: 'v_spinach', name: 'Espinafre no Vapor', portion: '1 xícara', category: 'veg', exchangeGroup: 'green_cooked', tags: ['vegan', 'health', 'lunch_dinner', 'rich_iron', 'rich_calcium'], calories: 30, macros: { protein: 3, carbs: 4, fat: 0 }, approxPrice: 'medium', prepTime: 5, prepMethod: 'Vapor' },

        { id: 'v_broccoli', name: 'Brócolis Vapor', portion: '1 xícara', category: 'veg', exchangeGroup: 'cruciferous', tags: ['vegan', 'health', 'lunch_dinner'], calories: 35, macros: { protein: 3, carbs: 6, fat: 0 }, approxPrice: 'medium', prepTime: 10, prepMethod: 'Vapor' },
        { id: 'v_cauliflower', name: 'Couve-Flor Assada', portion: '1 xícara', category: 'veg', exchangeGroup: 'cruciferous', tags: ['vegan', 'lunch_dinner'], calories: 30, macros: { protein: 2, carbs: 5, fat: 0 }, approxPrice: 'medium', prepTime: 20, prepMethod: 'Assado' },

        { id: 'v_zucchini', name: 'Abobrinha Refogada', portion: '1/2 unidade', category: 'veg', exchangeGroup: 'veg_cooked', tags: ['vegan', 'quick_prep', 'lunch_dinner'], calories: 30, macros: { protein: 2, carbs: 5, fat: 1 }, approxPrice: 'low', prepTime: 10, prepMethod: 'Refogado' },
        { id: 'v_eggplant', name: 'Berinjela Assada', portion: '1/2 unidade', category: 'veg', exchangeGroup: 'veg_cooked', tags: ['vegan', 'lunch_dinner'], calories: 35, macros: { protein: 1, carbs: 6, fat: 0 }, approxPrice: 'low', prepTime: 20, prepMethod: 'Assado' },
        { id: 'v_carrot', name: 'Cenoura Ralada', portion: '1 unidade pequena', category: 'veg', exchangeGroup: 'root_veg', tags: ['vegan', 'cheap', 'no_cook', 'lunch_dinner'], calories: 30, macros: { protein: 1, carbs: 7, fat: 0 }, approxPrice: 'low', prepTime: 5, prepMethod: 'Cru/Ralado' },
        { id: 'v_beet', name: 'Beterraba Cozida', portion: '1 unidade pequena', category: 'veg', exchangeGroup: 'root_veg', tags: ['vegan', 'lunch_dinner'], calories: 40, macros: { protein: 1, carbs: 9, fat: 0 }, approxPrice: 'low', prepTime: 30, prepMethod: 'Cozida' },
        { id: 'v_tomato', name: 'Tomate', portion: '1 unidade', category: 'veg', exchangeGroup: 'fruit_veg', tags: ['vegan', 'cheap', 'no_cook', 'lunch_dinner'], calories: 20, macros: { protein: 1, carbs: 4, fat: 0 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Fatiado' },
    ],

    // --- FRUITS (Low Carb/Fiber) ---
    fruits: [
        { id: 'fr_apple', name: 'Maçã', portion: '1 unidade média', category: 'fruit', exchangeGroup: 'fruit', tags: ['vegan', 'snack', 'cheap', 'no_cook'], calories: 70, macros: { protein: 0, carbs: 19, fat: 0 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Natural' },
        { id: 'fr_pear', name: 'Pêra', portion: '1 unidade média', category: 'fruit', exchangeGroup: 'fruit', tags: ['vegan', 'snack'], calories: 80, macros: { protein: 0, carbs: 21, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Natural' },
        { id: 'fr_papaya', name: 'Mamão Papaia', portion: '1/2 unidade', category: 'fruit', exchangeGroup: 'fruit', tags: ['vegan', 'breakfast', 'health'], calories: 60, macros: { protein: 1, carbs: 15, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Natural' },
        { id: 'fr_berries', name: 'Morangos', portion: '10 unidades', category: 'fruit', exchangeGroup: 'fruit', tags: ['vegan', 'snack', 'low_carb'], calories: 40, macros: { protein: 1, carbs: 10, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Natural' },
        { id: 'fr_melon', name: 'Melão', portion: '1 fatia grande', category: 'fruit', exchangeGroup: 'fruit', tags: ['vegan', 'snack', 'low_carb'], calories: 40, macros: { protein: 1, carbs: 10, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Fatiado' },
        { id: 'fr_pineapple', name: 'Abacaxi', portion: '2 rodelas', category: 'fruit', exchangeGroup: 'fruit', tags: ['vegan', 'snack'], calories: 70, macros: { protein: 1, carbs: 18, fat: 0 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Fatiado' },
    ],

    // --- DAIRY ---
    dairy: [
        { id: 'd_milk', name: 'Leite Desnatado', portion: '1 copo (200ml)', category: 'dairy', exchangeGroup: 'milk', tags: ['vegetarian', 'cheap', 'breakfast', 'rich_calcium'], calories: 70, macros: { protein: 7, carbs: 10, fat: 0 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Natural' },
        { id: 'd_milk_whole', name: 'Leite Integral', portion: '1 copo (200ml)', category: 'dairy', exchangeGroup: 'milk', tags: ['vegetarian', 'breakfast', 'rich_calcium'], calories: 120, macros: { protein: 6, carbs: 10, fat: 6 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Natural' },
        { id: 'd_cheese_white', name: 'Queijo Minas Frescal', portion: '2 fatias (50g)', category: 'dairy', exchangeGroup: 'cheese', tags: ['vegetarian', 'breakfast', 'snack'], calories: 120, macros: { protein: 9, carbs: 2, fat: 9 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Fatiado' },
        { id: 'd_cheese_moz', name: 'Queijo Mussarela', portion: '2 fatias', category: 'dairy', exchangeGroup: 'cheese', tags: ['vegetarian', 'breakfast'], calories: 140, macros: { protein: 8, carbs: 2, fat: 10 }, approxPrice: 'medium', prepTime: 0, prepMethod: 'Fatiado' },
        { id: 'd_yogurt_plain', name: 'Iogurte Natural', portion: '1 pote (170g)', category: 'dairy', exchangeGroup: 'dairy_protein', tags: ['vegetarian', 'breakfast', 'snack'], calories: 100, macros: { protein: 6, carbs: 9, fat: 6 }, approxPrice: 'low', prepTime: 0, prepMethod: 'Natural' },
    ]
};
