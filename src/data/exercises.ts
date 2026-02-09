import { Exercise } from '../types/workout';

export const EXERCISE_LIBRARY: Record<string, Exercise> = {
    'jumping_jack': {
        id: 'jumping_jack',
        name: 'Polichinelo',
        muscleGroup: 'cardio',
        category: 'cardio',
        equipment: ['bodyweight_only'],
        description: 'Start standing, jump legs apart and raise arms overhead.',
        difficulty: 'beginner',
        stimulus: ['cardio_respiratory'],
        mechanic: 'compound',
        tips: ['Land softly', 'Keep core tight'],
        lowImpactAlt: 'step_jack',
        instructions: [
            'Comece em pé com os pés juntos e os braços ao lado do corpo.',
            'Salte e afaste as pernas além da largura dos ombros, levantando os braços acima da cabeça.',
            'Salte novamente para retornar à posição inicial, baixando os braços.',
            'Mantenha um ritmo constante e pouse suavemente na ponta dos pés.'
        ]
    },
    'step_jack': {
        id: 'step_jack',
        name: 'Polichinelo Adaptado (Step Jack)',
        muscleGroup: 'cardio',
        category: 'cardio',
        equipment: ['bodyweight_only'],
        description: 'Step side to side instead of jumping.',
        difficulty: 'beginner',
        stimulus: ['cardio_respiratory'],
        mechanic: 'compound',
        tags: ['#low_impact', '#apartment_friendly'],
        tips: ['Keep pace up'],
        instructions: [
            'Fique em pé com os pés juntos.',
            'Dê um passo lateral com o pé direito e levante os braços acima da cabeça.',
            'Retorne o pé direito ao centro e baixe os braços.',
            'Repita com o lado esquerdo.',
            'Mantenha um ritmo acelerado sem pular para reduzir o impacto.'
        ]
    },
    'mountain_climber': {
        id: 'mountain_climber',
        name: 'Mountain Climber',
        muscleGroup: 'core',
        category: 'cardio',
        equipment: ['bodyweight_only'],
        description: 'Plank position, alternate driving knees to chest.',
        difficulty: 'intermediate',
        stimulus: ['cardio_respiratory', 'endurance'],
        mechanic: 'compound',
        tips: ['Keep hips down', 'Maintain rhythm'],
        instructions: [
            'Comece na posição de prancha alta, mãos alinhadas com os ombros.',
            'Leve o joelho direito em direção ao peito, mantendo o quadril baixo.',
            'Troque rapidamente, estendendo a perna direita e trazendo o joelho esquerdo.',
            'Mantenha o core firme e o corpo alinhado durante todo o movimento.'
        ]
    },
    'push_up': {
        id: 'push_up',
        name: 'Push Up',
        muscleGroup: 'chest',
        category: 'bodyweight',
        equipment: ['bodyweight_only'],
        description: 'Classic push up.',
        difficulty: 'beginner',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['shoulders', 'arms'],
        tips: ['Chest to floor', 'Elbows 45 degrees'],
        instructions: [
            'Posição de prancha, mãos um pouco mais largas que os ombros.',
            'Desça o corpo flexionando os cotovelos até o peito quase tocar o chão.',
            'Empurre o chão para retornar à posição inicial.',
            'Mantenha o corpo reto como uma tábua; não deixe o quadril cair.'
        ]
    },
    'squat_bodyweight': {
        id: 'squat_bodyweight',
        name: 'Agachamento',
        muscleGroup: 'legs',
        category: 'bodyweight',
        equipment: ['bodyweight_only'],
        description: 'Bodyweight squat.',
        difficulty: 'beginner',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        tips: ['Knees out', 'Chest up'],
        tags: ['#feminino'],
        instructions: [
            'Pés na largura dos ombros, pontas levemente para fora.',
            'Inicie o movimento levando o quadril para trás e para baixo (como sentar).',
            'Desça até que as coxas fiquem paralelas ao chão.',
            'Mantenha o peito estufado e os calcanhares no chão ao subir.'
        ]
    },
    'child_pose': {
        id: 'child_pose',
        name: 'Child Pose',
        muscleGroup: 'back',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Resting pose.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,
        tips: ['Relax breathing'],
        instructions: [
            'Ajoelhe-se nop chão e sente-se sobre os calcanhares.',
            'Incline o tronco para frente, estendendo os braços o máximo possível.',
            'Encoste a testa no chão e relaxe o pescoço.',
            'Respire profundamente, sentindo o alongamento nas costas.'
        ]
    },
    'stretch_hamstring': {
        id: 'stretch_hamstring',
        name: 'Alongamento Posterior',
        muscleGroup: 'legs',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Hamstring stretch.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,
        tips: ['Keep leg straight'],
        instructions: [
            'Em pé ou sentado, estenda uma perna à frente.',
            'Mantenha a coluna reta e incline o tronco em direção ao pé.',
            'Evite curvar demais as costas; o foco é na parte posterior da coxa.',
            'Segure a posição sentindo um alongamento moderado.'
        ]
    },
    'run_light': {
        id: 'run_light',
        name: 'Corrida Leve',
        muscleGroup: 'cardio',
        category: 'cardio',
        equipment: ['bodyweight_only'],
        description: 'Light jog in place or outside.',
        difficulty: 'beginner',
        stimulus: ['cardio_respiratory'],
        mechanic: 'compound',

        tips: ['Breathe rhythmically'],
        instructions: [
            'Corra no lugar ou em deslocamento suave.',
            'Mantenha um ritmo onde consiga conversar (intensidade leve).',
            'Pouse suavemente com o meio do pé ou ponta, amortecendo o impacto.',
            'Mantenha a postura ereta e braços relaxados.'
        ]
    },
    'shoulder_dislocate': {
        id: 'shoulder_dislocate',
        name: 'Shoulder Dislocates',
        muscleGroup: 'shoulders',
        category: 'mobility',
        equipment: ['bodyweight_only', 'resistance_band'], // Often uses stick/band
        description: 'Shoulder mobility exercise.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,

        tips: ['Start wide', 'Keep arms straight'],
        instructions: [
            'Segure um bastão ou elástico com uma pegada bem aberta (mais que os ombros).',
            'Com os braços esticados, leve o bastão de frente para trás da cabeça.',
            'Vá até onde sua mobilidade permite sem forçar ou sentir dor.',
            'Retorne à posição inicial de forma controlada.'
        ]
    },
    'cat_cow': {
        id: 'cat_cow',
        name: 'Gato e Vaca',
        muscleGroup: 'back',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Spinal mobility.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,
        tips: ['Move with breath'],
        tags: ['#feminino'],
        instructions: [
            'Em quatro apoios (mãos e joelhos).',
            'Inspire e arqueie as costas, olhando para cima (Vaca).',
            'Expire e curve as costas para cima, olhando para o umbigo (Gato).',
            'Mova-se fluidamente com a respiração.'
        ]
    },
    'thoracic_rot': {
        id: 'thoracic_rot',
        name: 'Rotação Torácica',
        muscleGroup: 'back',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Thoracic spine rotation.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,

        tips: ['Follow hand with eyes'],
        instructions: [
            'Em quatro apoios, coloque uma mão na nuca.',
            'Gire o tronco levando o cotovelo em direção ao braço de apoio.',
            'Em seguida, gire para cima, apontando o cotovelo para o teto.',
            'Siga o movimento com o olhar para maximizar a rotação.'
        ]
    },
    'hip_opener': {
        id: 'hip_opener',
        name: 'Abertura de Quadril',
        muscleGroup: 'legs',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Hip mobility stretch.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,

        tips: ['Breathe into stretch'],
        instructions: [
            'Fique na posição de afundo (um joelho no chão, pé oposto à frente).',
            'Empurre o quadril para frente mantendo o tronco ereto.',
            'Contraia levemente o glúteo da perna de trás.',
            'Sinta alongar a frente do quadril (flexores).'
        ]
    },
    'pigeon_pose': {
        id: 'pigeon_pose',
        name: 'Pombo',
        muscleGroup: 'legs',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Glute stretch.',
        difficulty: 'intermediate',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,
        tips: ['Keep hips square'],
        instructions: [
            'Comece em prancha ou quatro apoios.',
            'Traga o joelho direito à frente, próximo à mão direita.',
            'Gire a perna para que o pé direito vá em direção à mão esquerda.',
            'Estenda a perna esquerda para trás e desça o quadril.',
            'Se possível, incline o tronco à frente sobre a perna dobrada.'
        ]
    },
    'arm_circles': {
        id: 'arm_circles',
        name: 'Círculos com Braços',
        muscleGroup: 'shoulders',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Dynamic shoulder warmup.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',

        tips: ['Start small, go bigger'],
        instructions: [
            'Em pé, estenda os braços lateralmente na altura dos ombros.',
            'Faça movimentos circulares controlados.',
            'Comece com círculos pequenos e aumente gradualmente a amplitude.',
            'Faça o movimento nos dois sentidos (frente e trás).'
        ]
    },
    'glute_bridge': {
        id: 'glute_bridge',
        name: 'Elevação Pélvica',
        muscleGroup: 'legs',
        category: 'bodyweight',
        equipment: ['bodyweight_only'],
        description: 'Glute bridge.',
        difficulty: 'beginner',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'isolation',
        secondaryMuscles: ['core'],
        tips: ['Squeeze glutes at top'],
        tags: ['#feminino'],
        instructions: [
            'Deite-se de costas, joelhos dobrados e pés no chão.',
            'Eleve o quadril contraindo os glúteos até formar uma linha reta joelho-ombro.',
            'Segure por 1-2 segundos no topo, apertando bem.',
            'Desça controladamente sem tocar totalmente o chão entre repetições.'
        ]
    },
    'stretch_quad': {
        id: 'stretch_quad',
        name: 'Alongamento Quadríceps',
        muscleGroup: 'legs',
        category: 'mobility',
        equipment: ['bodyweight_only'],
        description: 'Standing or kneeling quad stretch.',
        difficulty: 'beginner',
        stimulus: ['endurance'],
        mechanic: 'isolation',
        isMobility: true,

        tips: ['Keep knees close'],
        instructions: [
            'Em pé (apoie-se na parede se precisar), dobre uma perna para trás.',
            'Segure o pé com a mão do mesmo lado.',
            'Puxe o calcanhar em direção ao glúteo suavemente.',
            'Mantenha os joelhos próximos e o quadril encaixado (não empine).'
        ]
    },
    'push_up_pike': {
        id: 'push_up_pike',
        name: 'Pike Push Up',
        muscleGroup: 'shoulders',
        category: 'bodyweight',
        equipment: ['bodyweight_only'],
        description: 'Push up in pike position.',
        difficulty: 'intermediate',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['arms'],

        tips: ['Head towards hands'],
        instructions: [
            'Comece na posição de prancha alta.',
            'Caminhe com os pés em direção às mãos, elevando o quadril (formando um V invertido).',
            'Flexione os cotovelos para descer o topo da cabeça em direção ao chão.',
            'Empurre o chão com força para retornar à posição inicial. Foco nos ombros.'
        ]
    },
    'dead_bug': {
        id: 'dead_bug',
        name: 'Dead Bug',
        muscleGroup: 'core',
        category: 'bodyweight',
        equipment: ['bodyweight_only'],
        description: 'Core stability exercise.',
        difficulty: 'beginner',
        stimulus: ['strength', 'endurance'],
        mechanic: 'isolation',

        tips: ['Keep lower back flat'],
        instructions: [
            'Deite de costas, braços estendidos para o teto e pernas em 90º (posição de cadeirinha).',
            'Desça o braço direito para trás e estique a perna esquerda à frente simultaneamente.',
            'Mantenha a lombar colada no chão o tempo todo.',
            'Retorne ao centro e troque os lados (braço esquerdo, perna direita).'
        ]
    },
    'bird_dog': {
        id: 'bird_dog',
        name: 'Perdigueiro',
        muscleGroup: 'core',
        category: 'bodyweight',
        equipment: ['bodyweight_only'],
        description: 'Core stability exercise.',
        difficulty: 'beginner',
        stimulus: ['strength', 'endurance'],
        mechanic: 'isolation',
        tips: ['Extend opposite arm and leg'],
        tags: ['#feminino'],
        instructions: [
            'Em quatro apoios, mantenha a coluna neutra.',
            'Estenda o braço direito à frente e a perna esquerda para trás simultaneamente.',
            'Segure por um momento, mantendo o equilíbrio.',
            'Retorne e troque os lados (braço esquerdo, perna direita).'
        ]
    },
    'hip_thrust': {
        id: 'hip_thrust',
        name: 'Elevação Pélvica (No Banco)',
        muscleGroup: 'legs',
        category: 'bodyweight',
        equipment: ['bodyweight_only', 'bench'],
        description: 'Upper back on bench, lift hips.',
        difficulty: 'intermediate',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'isolation',
        secondaryMuscles: ['core'], // 'glutes' is usually implicit in legs/isolation but let's stick to type
        tags: ['#feminino'],
        tips: ['Chin tucked', 'Drive through heels'],
        instructions: [
            'Apoie as escápulas (costas) em um banco ou sofá estável.',
            'Pés firmes no chão, joelhos dobrados.',
            'Abaixe o quadril e então suba com força contraindo os glúteos.',
            'No topo, as canelas devem estar verticais. Olhe para frente, queixo no peito.'
        ]
    },
    'sumo_squat': {
        id: 'sumo_squat',
        name: 'Agachamento Sumô',
        muscleGroup: 'legs',
        category: 'bodyweight',
        equipment: ['bodyweight_only'],
        description: 'Wide stance squat.',
        difficulty: 'beginner',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        tags: ['#feminino'],
        tips: ['Knees over toes', 'Chest up'],
        instructions: [
            'Afaste os pés mais que a largura dos ombros, pontas para fora (45°).',
            'Mantenha o tronco ereto e agache, empurrando os joelhos para fora.',
            'Foque na parte interna das coxas e glúteos para subir.',
            'Não deixe os joelhos caírem para dentro.'
        ]
    },

    'glute_kickback': {
        id: 'glute_kickback',
        name: 'Coice de Glúteo',
        muscleGroup: 'legs',
        category: 'isolation',
        equipment: ['bodyweight_only', 'resistance_band'],
        description: 'Kick leg back focusing on glute.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tags: ['#feminino'],
        tips: ['Squeeze glute', 'Minimal back arch'],
        instructions: [
            'Em quatro apoios (ou em pé com apoio).',
            'Chute a perna para trás e para cima, focando apenas no glúteo.',
            'Mantenha o joelho dobrado a 90° (versão donkey) ou perna esticada.',
            'Não arqueie a lombar; o movimento vem do quadril.'
        ]
    },
    'swiss_ball_crunch': {
        id: 'swiss_ball_crunch',
        name: 'Abdominal na Bola',
        muscleGroup: 'core',
        category: 'isolation',
        equipment: ['swiss_ball'],
        description: 'Crunch on swiss ball.',
        difficulty: 'beginner',
        stimulus: ['strength'],
        mechanic: 'isolation',
        tags: ['#feminino', '#core_stability'],
        tips: ['Engage core', 'Don\'t pull neck'],
        instructions: [
            'Deite com a lombar apoiada na bola suíça.',
            'Mãos atrás da cabeça ou no peito.',
            'Enrole o tronco para cima contraindo o abdômen.',
            'A bola oferece instabilidade que ativa mais o core.'
        ]
    },
    'step_up': {
        id: 'step_up',
        name: 'Subida no Step/Caixa',
        muscleGroup: 'legs',
        category: 'compound',
        equipment: ['step_platform', 'bench'], // Can use bench or sofa at home
        description: 'Step up onto platform.',
        difficulty: 'beginner',
        stimulus: ['strength', 'cardio_respiratory'],
        mechanic: 'compound',
        tags: ['#feminino', '#functional'],
        tips: ['Drive through heel', 'Control descent'],
        instructions: [
            'Coloque um pé inteiro sobre o banco/caixa.',
            'Faça força com essa perna para subir o corpo até estender o joelho.',
            'Toque o outro pé no topo ou apenas eleve o joelho.',
            'Desça devagar e controlado. Não despenque.'
        ]
    },
    'clam_shell': {
        id: 'clam_shell',
        name: 'Ostra (Clam Shell)',
        muscleGroup: 'legs',
        category: 'isolation',
        equipment: ['bodyweight_only', 'resistance_band'],
        description: 'Side lying, open knees like a clam.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tags: ['#feminino', '#glute_medius', '#low_impact'],
        tips: ['Keep feet touching', 'Hips stacked'],
        instructions: [
            'Deite de lado, pernas dobradas, pés juntos.',
            'Mantenha os pés colados e abra o joelho de cima como uma ostra.',
            'Não deixe o quadril girar para trás.',
            'Foque no glúteo médio (lateral do quadril).'
        ]
    },
    // --- GYM / HYPERTROPHY EXPANSION ---
    'bench_press_barbell': {
        id: 'bench_press_barbell',
        name: 'Supino Reto (Barra)',
        muscleGroup: 'chest',
        category: 'compound',
        equipment: ['gym'],
        description: 'Barbell bench press.',
        difficulty: 'intermediate',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['shoulders', 'arms'],
        tips: ['Arch back slightly', 'Leg drive', 'Touch chest'],
        instructions: [
            'Deite-se no banco, pés firmes no chão.',
            'Segure a barra um pouco mais largo que os ombros.',
            'Desça a barra controladamente até tocar o meio do peito.',
            'Empurre com força para cima, sem travar totalmente os cotovelos.'
        ]
    },
    'bench_press_dumbbell': {
        id: 'bench_press_dumbbell',
        name: 'Supino Reto (Halteres)',
        muscleGroup: 'chest',
        category: 'compound',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Dumbbell bench press.',
        difficulty: 'intermediate',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['shoulders', 'arms'],
        tips: ['Control weight', 'Full stretch'],
        instructions: [
            'Deite com um halter em cada mão.',
            'Empurre os pesos para cima, aproximando-os no topo.',
            'Desça até os cotovelos passarem levemente a linha do ombro.',
            'Mantenha os pulsos firmes.'
        ]
    },
    'incline_bench_dumbbell': {
        id: 'incline_bench_dumbbell',
        name: 'Supino Inclinado (Halteres)',
        muscleGroup: 'chest',
        category: 'compound',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Incline press focuses on upper chest.',
        difficulty: 'intermediate',
        stimulus: ['hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['shoulders'],
        tips: ['Focus on upper chest', 'Dont bounce'],
        instructions: [
            'Banco inclinado a 30-45 graus.',
            'Pressione os halteres para cima e levemente para trás (linha dos olhos).',
            'Foque na parte superior do peitoral.',
            'Controle bem a descida.'
        ]
    },
    'chest_fly_dumbbell': {
        id: 'chest_fly_dumbbell',
        name: 'Crucifixo Reto (Halteres)',
        muscleGroup: 'chest',
        category: 'isolation',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Chest isolation.',
        difficulty: 'intermediate',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['Slight elbow bend', 'Squeeze chest'],
        instructions: [
            'Deitado, segure os halteres acima do peito, palmas viradas uma para a outra.',
            'Abra os braços em arco (como um abraço) até sentir alongar o peito.',
            'Mantenha os cotovelos levemente flexionados.',
            'Retorne à posição inicial contraindo o peitoral.'
        ]
    },
    'cable_fly_high_to_low': {
        id: 'cable_fly_high_to_low',
        name: 'Crossover (Polia Alta)',
        muscleGroup: 'chest',
        category: 'isolation',
        equipment: ['gym', 'cable_machine'],
        description: 'High to low fly for lower/mid chest.',
        difficulty: 'intermediate',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        secondaryMuscles: ['shoulders'],
        tips: ['Step forward', 'Squeeze at bottom'],
        instructions: [
            'Polias no topo. Dê um passo à frente.',
            'Traga as mãos para baixo e para o centro (na frente do quadril).',
            'Mantenha o tronco levemente inclinado.',
            'Foque na parte inferior do peitoral.'
        ]
    },
    'cable_fly_mid': {
        id: 'cable_fly_mid',
        name: 'Crucifixo na Polia (Cabo)',
        muscleGroup: 'chest',
        category: 'isolation',
        equipment: ['gym', 'cable_machine'],
        description: 'Standard cable fly.',
        difficulty: 'intermediate',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        secondaryMuscles: ['shoulders'],
        tips: ['Chest up', 'Hug a tree'],
        instructions: [
            'Polias na altura dos ombros.',
            'Feche os braços na frente do peito.',
            'Mantenha os cotovelos destravados (semi-flexionados).',
            'Sinta o alongamento na volta e esmague o peito no centro.'
        ]
    },
    'cable_fly_low_to_high': {
        id: 'cable_fly_low_to_high',
        name: 'Crossover (Polia Baixa)',
        muscleGroup: 'chest',
        category: 'isolation',
        equipment: ['gym', 'cable_machine'],
        description: 'Low to high fly for upper chest.',
        difficulty: 'intermediate',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        secondaryMuscles: ['shoulders'],
        tips: ['Palms up', 'Lift to chin height'],
        instructions: [
            'Polias embaixo. Dê um passo à frente.',
            'Leve as mãos para cima e para o centro (altura do queixo).',
            'Foque na parte superior do peitoral (saboneteira).',
            'Controle a descida.'
        ]
    },
    'lat_pulldown': {
        id: 'lat_pulldown',
        name: 'Puxada Alta (Lat Pulldown)',
        muscleGroup: 'back',
        category: 'compound',
        equipment: ['gym', 'cable_machine'],
        description: 'Vertical pull for lats.',
        difficulty: 'beginner',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['arms'],
        tips: ['Pull with elbows', 'Chest up'],
        instructions: [
            'Sente-se e prenda os joelhos no suporte.',
            'Segure a barra com pegada aberta.',
            'Puxe a barra em direção ao topo do peito, estufando o peito.',
            'Foque em descer os cotovelos, não apenas puxar com as mãos.'
        ]
    },
    'bent_over_row_barbell': {
        id: 'bent_over_row_barbell',
        name: 'Remada Curvada (Barra)',
        muscleGroup: 'back',
        category: 'compound',
        equipment: ['gym', 'barbell'],
        description: 'Heavy back compound.',
        difficulty: 'advanced',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['arms', 'legs'],
        tips: ['Flat back', 'Pull to hips'],
        instructions: [
            'Pés na largura dos ombros, incline o tronco à frente (quase paralelo).',
            'Mantenha a coluna reta (neutra).',
            'Puxe a barra em direção ao umbigo.',
            'Controle a descida. Não use impulso excessivo.'
        ]
    },
    'seated_row_cable': {
        id: 'seated_row_cable',
        name: 'Remada Baixa (Cabo)',
        muscleGroup: 'back',
        category: 'compound',
        equipment: ['gym', 'cable_machine'],
        description: 'Seated row.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['arms'],
        tips: ['Straight back', 'Squeeze blades'],
        instructions: [
            'Sente-se com as costas retas.',
            'Puxe o triângulo/barra em direção ao abdômen.',
            'Estufe o peito ao puxar e esmague as escápulas.',
            'Alongue bem os braços na volta sem arredondar as costas.'
        ]
    },
    'squat_barbell': {
        id: 'squat_barbell',
        name: 'Agachamento Livre (Barra)',
        muscleGroup: 'legs',
        category: 'compound',
        equipment: ['gym', 'barbell'],
        description: 'King of leg exercises.',
        difficulty: 'advanced',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['core'],
        tips: ['Knees out', 'Chest up', 'Brace core'],
        instructions: [
            'Barra apoiada no trapézio.',
            'Pés na largura dos ombros.',
            'Agache jogando o quadril para trás e joelhos para fora.',
            'Quebre a paralela (quadril abaixo do joelho) se tiver mobilidade.',
            'Mantenha o peito estufado e suba empurrando o chão.'
        ]
    },
    'leg_press': {
        id: 'leg_press',
        name: 'Leg Press 45°',
        muscleGroup: 'legs',
        category: 'compound',
        equipment: ['gym', 'machine'],
        description: 'Heavy leg machine.',
        difficulty: 'beginner',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        tips: ['Dont lock knees', 'Push through heels'],
        instructions: [
            'Apoie as costas totalmente no banco.',
            'Pés na plataforma, largura dos ombros.',
            'Desça o peso até formar 90 graus nos joelhos.',
            'Empurre de volta sem travar (estender totalmente) os joelhos no final.'
        ]
    },
    'romanian_deadlift_barbell': {
        id: 'romanian_deadlift_barbell',
        name: 'Stiff / RDL (Barra)',
        muscleGroup: 'legs',
        category: 'compound',
        equipment: ['gym', 'barbell'],
        description: 'Hamstring and glute focus.',
        difficulty: 'intermediate',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['back'],
        tips: ['Hinge at hips', 'Feel hamstrings'],
        instructions: [
            'Segure a barra na frente das coxas.',
            'Desça a barra raspando nas pernas, jogando o quadril para trás.',
            'Mantenha os joelhos semi-flexionados (fixos).',
            'Desça até sentir alongar bem a posterior. A coluna DEVE estar reta.',
            'Volte contraindo os glúteos.'
        ]
    },
    'leg_extension': {
        id: 'leg_extension',
        name: 'Cadeira Extensora',
        muscleGroup: 'legs',
        category: 'isolation',
        equipment: ['gym', 'machine'],
        description: 'Quad isolation.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['Squeeze at top', 'Control down'],
        instructions: [
            'Ajuste o banco para que o joelho alinhe com o eixo.',
            'Estenda as pernas totalmente contraindo o quadríceps.',
            'Segure 1 segundo no topo.',
            'Desça controladamente.'
        ]
    },
    'leg_curl': {
        id: 'leg_curl',
        name: 'Mesa Flexora',
        muscleGroup: 'legs',
        category: 'isolation',
        equipment: ['gym', 'machine'],
        description: 'Hamstring isolation.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['Keep hips down', 'Full curl'],
        instructions: [
            'Deite-se e prenda o calcanhar no rolo.',
            'Dobre os joelhos trazendo o rolo em direção ao glúteo.',
            'Não levante o quadril do banco.',
            'Desça devagar.'
        ]
    },
    'overhead_press_barbell': {
        id: 'overhead_press_barbell',
        name: 'Desenvolvimento Militar (Barra)',
        muscleGroup: 'shoulders',
        category: 'compound',
        equipment: ['gym', 'barbell'],
        description: 'Overhead press.',
        difficulty: 'intermediate',
        stimulus: ['strength', 'hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['arms', 'core'],
        tips: ['Core tight', 'Head through window'],
        instructions: [
            'Barra apoiada no peito/ombros.',
            'Empurre a barra verticalmente até estender os braços.',
            'A cabeça vai levemente à frente no topo (janela nos braços).',
            'Mantenha glúteos e abdômem travados para não arquear as costas.'
        ]
    },
    'lateral_raise_dumbbell': {
        id: 'lateral_raise_dumbbell',
        name: 'Elevação Lateral',
        muscleGroup: 'shoulders',
        category: 'isolation',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Side delt isolation.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['Lead with elbows', 'No swinging'],
        instructions: [
            'Em pé, halteres ao lado do corpo.',
            'Eleve os braços lateralmente até a altura dos ombros.',
            'Mantenha os cotovelos levemente flexionados.',
            'Imagine que está despejando uma jarra de água no topo.'
        ]
    },
    'front_raise_dumbbell': {
        id: 'front_raise_dumbbell',
        name: 'Elevação Frontal',
        muscleGroup: 'shoulders',
        category: 'isolation',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Anterior delt isolation.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['Control descent', 'No swinging'],
        instructions: [
            'Segure os halteres na frente das coxas.',
            'Levante os braços à frente até a altura dos ombros.',
            'Mantenha os braços estendidos.',
            'Desça devagar, resistindo à gravidade.'
        ]
    },
    'reverse_fly_dumbbell': {
        id: 'reverse_fly_dumbbell',
        name: 'Crucifixo Inverso',
        muscleGroup: 'shoulders',
        category: 'isolation',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Posterior delt isolation.',
        difficulty: 'intermediate',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        secondaryMuscles: ['back'],
        tips: ['Squeeze shoulder blades', 'Pinkies up'],
        instructions: [
            'Incline o tronco à frente (quase paralelo).',
            'Abra os braços lateralmente como asas.',
            'Foque na parte de trás dos ombros (deltoide posterior).',
            'Não use impulso das costas.'
        ]
    },
    'arnold_press': {
        id: 'arnold_press',
        name: 'Desenvolvimento Arnold',
        muscleGroup: 'shoulders',
        category: 'compound',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Rotational shoulder press.',
        difficulty: 'advanced',
        stimulus: ['hypertrophy', 'strength'],
        mechanic: 'compound',
        secondaryMuscles: ['arms'],
        tips: ['Full rotation', 'Press straight up'],
        instructions: [
            'Comece com as palmas viradas para você (na frente do rosto).',
            'Ao subir, gire os punhos para fora.',
            'No topo, as palmas devem estar viradas para frente.',
            'Faça o caminho inverso na descida.'
        ]
    },
    'upright_row_cable': {
        id: 'upright_row_cable',
        name: 'Remada Alta (Polia)',
        muscleGroup: 'shoulders',
        category: 'compound',
        equipment: ['gym', 'cable_machine'],
        description: 'Side delts and traps.',
        difficulty: 'intermediate',
        stimulus: ['hypertrophy'],
        mechanic: 'compound',
        secondaryMuscles: ['back'],
        tips: ['Elbows high', 'Bar close to body'],
        instructions: [
            'Segure a barra da polia baixa com pegada pronada.',
            'Puxe a barra rente ao corpo até a altura do peito.',
            'Os cotovelos devem subir mais que as mãos.',
            'Foque na lateral do ombro, não force o pescoço.'
        ]
    },
    'face_pull': {
        id: 'face_pull',
        name: 'Face Pull',
        muscleGroup: 'shoulders',
        category: 'isolation',
        equipment: ['gym', 'cable_machine', 'resistance_band'],
        description: 'Rear delt and rotator cuff.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy', 'endurance'],
        mechanic: 'isolation',
        secondaryMuscles: ['back'],
        tips: ['Pull to forehead', 'External rotation'],
        instructions: [
            'Polia na altura do rosto/testa. Use a corda.',
            'Puxe a corda em direção ao testa, separando as mãos.',
            'Gire os ombros para trás (rotação externa) no final.',
            'Excelente para postura e saúde dos ombros.'
        ]
    },
    'tricep_pushdown': {
        id: 'tricep_pushdown',
        name: 'Tríceps Pulley (Corda/Barra)',
        muscleGroup: 'arms',
        category: 'isolation',
        equipment: ['gym', 'cable_machine'],
        description: 'Tricep isolation.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['Elbows tight', 'Lock out'],
        instructions: [
            'Pés firmes, corpo levemente inclinado à frente.',
            'Cotovelos colados nas costelas (não mova os cotovelos).',
            'Estenda o braço empurrando para baixo.',
            'Alongue na volta até o antebraço encostar no bíceps.'
        ]
    },
    'bicep_curl_barbell': {
        id: 'bicep_curl_barbell',
        name: 'Rosca Direta (Barra)',
        muscleGroup: 'arms',
        category: 'isolation',
        equipment: ['gym', 'barbell'],
        description: 'Bicep builder.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['No swinging', 'Squeeze biceps'],
        instructions: [
            'Segure a barra na largura dos ombros.',
            'Flexione os cotovelos trazendo a barra até o peito.',
            'Mantenha os cotovelos parados ao lado do corpo.',
            'Evite jogar o corpo para trás (roubar).'
        ]
    },
    'hammer_curl': {
        id: 'hammer_curl',
        name: 'Rosca Martelo',
        muscleGroup: 'arms',
        category: 'isolation',
        equipment: ['gym', 'home_dumbbells'],
        description: 'Brachialis focus.',
        difficulty: 'beginner',
        stimulus: ['hypertrophy'],
        mechanic: 'isolation',
        tips: ['Neutral grip', 'Forearms focus'],
        instructions: [
            'Palmas das mãos voltadas para o corpo (pegada neutra).',
            'Levante o halter mantendo essa posição.',
            'Excelente para a lateral do braço e antebraço.'
        ]
    },
    'deadlift_barbell': {
        id: 'deadlift_barbell',
        name: 'Levantamento Terra (Deadlift)',
        muscleGroup: 'back',
        category: 'compound',
        equipment: ['gym', 'barbell'],
        description: 'Full body strength.',
        difficulty: 'advanced',
        stimulus: ['strength', 'power'],
        mechanic: 'compound',
        secondaryMuscles: ['legs', 'core'],
        tips: ['Flat back', 'Bar close to shins'],
        instructions: [
            'Pés na largura do quadril, barra sobre o meio dos pés.',
            'Segure a barra, desça o quadril e estufe o peito.',
            'Mantenha a coluna neutra e braços esticados.',
            'Faça força contra o chão para subir, estendendo quadril e joelhos juntos.'
        ]
    }
};


