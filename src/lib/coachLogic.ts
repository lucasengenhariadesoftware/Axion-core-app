import { CoachingMessage, LearningProfile, DietPreferences } from '../types/diet';
import { FOOD_DATABASE } from './foodDatabase';

const INSIGHT_TEMPLATES = [
    {
        category: 'habit',
        title: 'Hábito Detectado',
        getText: (p: LearningProfile) => `Você troca frango por peixe em frequencia. Que tal oficializarmos isso?`,
        actionLabel: 'Priorizar Peixe',
        type: 'insight'
    },
    {
        category: 'economy',
        title: 'Economia Inteligente',
        getText: () => 'Ovos são 4x mais baratos que carne. Troque 2 jantares e economize R$ 40/mês.',
        actionLabel: 'Ver Receitas com Ovos',
        type: 'suggestion'
    },
    {
        category: 'time',
        title: 'Poupa-Tempo',
        getText: () => 'Detectei dias corridos. Que tal sugestões de "Café em 5 min" para amanhã?',
        actionLabel: 'Ativar Modo Expresso',
        type: 'suggestion'
    },
    {
        category: 'health',
        title: 'Foco na Fibra',
        getText: () => 'Sua ingestão de vegetais caiu. Vamos adicionar uma salada extra hoje?',
        actionLabel: 'Adicionar Salada',
        type: 'warning'
    },
    {
        category: 'habit',
        title: 'Hidratação',
        getText: () => 'Você bateu a meta de água 3 dias seguidos. Continue assim para melhorar a definição!',
        actionLabel: null, // Apenas elogio
        type: 'insight'
    },
    {
        category: 'economy',
        title: 'Dica de Mercado',
        getText: () => 'A safra de Abóbora está ótima. É barato e low-carb. Quer incluir?',
        actionLabel: 'Incluir Abóbora',
        type: 'suggestion'
    },
    {
        category: 'health',
        title: 'Proteína Matinal',
        getText: () => 'Começar o dia com mais proteína reduz a fome à noite. Que tal ovos no café?',
        actionLabel: 'Mudar Café da Manhã',
        type: 'suggestion'
    },
    {
        category: 'time',
        title: 'Cozinhar em Lote',
        getText: () => 'Se você cozinhar o dobro de feijão hoje, ganha 20min na quarta-feira.',
        actionLabel: 'Duplicar Porção',
        type: 'insight'
    }
] as const;

export const generateCoachMessage = (profile: LearningProfile, prefs: DietPreferences | null): CoachingMessage => {
    // 1. Filter relevant templates (mock simple logic)
    let relevant = INSIGHT_TEMPLATES;

    if (prefs?.goal === 'lose_weight') {
        // Boost health/habit
        relevant = relevant.filter(t => t.category !== 'economy');
    }

    // 2. Pick random
    const template = relevant[Math.floor(Math.random() * relevant.length)];

    return {
        id: Math.random().toString(36).substr(2, 9),
        type: template.type as any,
        category: template.category as any,
        title: template.title,
        text: template.getText(profile),
        actionLabel: template.actionLabel || undefined,
        dismissed: false
    };
};
