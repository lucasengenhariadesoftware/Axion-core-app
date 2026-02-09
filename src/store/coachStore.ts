import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CoachService } from '../services/CoachService';
import { useUserStore } from './userStore';

export type CoachMode = 'quick' | 'deep' | 'plan' | 'emergency';

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: number;
    type?: 'text' | 'action' | 'report';
}

export interface Insight {
    id: string;
    type: 'positive' | 'warning' | 'opportunity';
    title: string;
    description: string;
    action?: string;
}

export interface CoachState {
    messages: ChatMessage[];
    mode: CoachMode;
    dailyScore: number;
    scoreDelta: number; // vs yesterday
    status: {
        focus: 'good' | 'warning' | 'critical';
        energy: 'good' | 'warning' | 'critical';
        recovery: 'good' | 'warning' | 'critical';
    };
    insights: Insight[];
    isTyping: boolean;

    // Access Control
    dailyMessageCount: number;
    lastMessageDate: string | null;
    premiumUntil: number; // Timestamp

    // Actions
    sendMessage: (text: string) => boolean; // Returns true if sent, false if limit reached
    setMode: (mode: CoachMode) => void;
    clearHistory: () => void;
    activatePremium: () => void;
}

export const useCoachStore = create<CoachState>()(
    persist(
        (set, get) => ({
            messages: [
                {
                    id: 'welcome',
                    sender: 'ai',
                    text: 'Olá! Sou seu Coach IA. Como posso ajudar você a atingir seu pico de performance hoje?',
                    timestamp: Date.now()
                }
            ],
            mode: 'quick',
            dailyScore: 76,
            scoreDelta: 5,
            status: {
                focus: 'good',
                energy: 'warning',
                recovery: 'good'
            },
            insights: [
                {
                    id: '1',
                    type: 'opportunity',
                    title: 'Cronobiologia & Foco',
                    description: 'Seu pico de cortisol ocorre às 08:00. Trabalho profundo é 2x mais eficaz entre 09:00 e 11:00.',
                },
                {
                    id: '2',
                    type: 'positive',
                    title: 'Neuroplasticidade',
                    description: 'Aprender novas habilidades motoras logo após o treino aeróbico aumenta a retenção neural em 30%.',
                },
                {
                    id: '3',
                    type: 'warning',
                    title: 'Hidratação Cognitiva',
                    description: 'Uma queda de apenas 2% na hidratação corporal pode reduzir sua capacidade de foco em até 20%.',
                },
                {
                    id: '4',
                    type: 'positive',
                    title: 'Power Nap',
                    description: 'Cochilos de 20min entre 13h-15h restauram o estado de alerta em 100% sem causar inércia do sono.',
                },
                {
                    id: '5',
                    type: 'opportunity',
                    title: 'Zona 2 (Mitocôndrias)',
                    description: '45min de cardio leve (Zona 2) aumenta a eficiência mitocondrial e queima de gordura basal.',
                },
                {
                    id: '6',
                    type: 'warning',
                    title: 'Luz Azul vs. Sono',
                    description: 'Exposição a telas 1h antes de dormir reduz a melatonina em 50%, prejudicando o sono REM.',
                },
                {
                    id: '7',
                    type: 'opportunity',
                    title: 'Força de Preensão',
                    description: 'A força do aperto de mão é um dos biomarcadores mais fortes de longevidade e saúde geral.',
                },
                {
                    id: '8',
                    type: 'positive',
                    title: 'Regra 90/90/1',
                    description: 'Dedique os primeiros 90min do dia, pelos próximos 90 dias, à sua prioridade nº 1.',
                },
                {
                    id: '9',
                    type: 'warning',
                    title: 'Déficit de Proteína',
                    description: 'Ingerir < 1.6g/kg de proteína pode acelerar a perda muscular (sarcopenia) mesmo com treino.',
                }
            ],
            isTyping: false,

            dailyMessageCount: 0,
            lastMessageDate: null,
            premiumUntil: 0,

            setMode: (mode) => set({ mode }),

            clearHistory: () => set({ messages: [] }),

            activatePremium: () => {
                set({ premiumUntil: Date.now() + (5 * 60 * 60 * 1000) }); // 5 Hours
            },

            sendMessage: (text) => {
                const state = get();
                const today = new Date().toDateString();
                const globalPremium = useUserStore.getState().isPremium;
                const isPremium = globalPremium || Date.now() < state.premiumUntil;

                // Reset limit if new day
                if (state.lastMessageDate !== today) {
                    set({ dailyMessageCount: 0, lastMessageDate: today });
                    // Re-fetch state after reset to ensure current count is 0
                }

                // Check Limits
                const currentCount = state.lastMessageDate === today ? state.dailyMessageCount : 0;

                if (!isPremium && currentCount >= 3) {
                    return false; // Limit reached
                }

                const userMsg: ChatMessage = {
                    id: Date.now().toString(),
                    sender: 'user',
                    text,
                    timestamp: Date.now()
                };

                set(state => ({
                    messages: [...state.messages, userMsg],
                    isTyping: true,
                    dailyMessageCount: (state.lastMessageDate === today ? state.dailyMessageCount : 0) + 1,
                    lastMessageDate: today
                }));

                // Mock AI Response Logic (Simulated Latency)
                setTimeout(() => {
                    const response = CoachService.processMessage(text, isPremium);

                    const aiMsg: ChatMessage = {
                        id: (Date.now() + 1).toString(),
                        sender: 'ai',
                        text: response.text,
                        timestamp: Date.now()
                    };

                    set(state => ({
                        messages: [...state.messages, aiMsg],
                        isTyping: false
                    }));
                }, 1500);

                return true;
            }
        }),
        {
            name: 'axion-coach-storage-v2'
        }
    )
);
