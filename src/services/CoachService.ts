import { buildCoachContext, AIContext } from '../lib/CoachContextBuilder';

export interface CoachResponse {
    text: string;
    action?: string;
    dataSnapshot?: any;
}

export class CoachService {

    static processMessage(userMessage: string, isPremium: boolean = false): CoachResponse {
        const context = buildCoachContext();
        const lowerMsg = userMessage.toLowerCase();

        // 1. Analyze Intent
        if (lowerMsg.includes('analisar') || lowerMsg.includes('resumo') || lowerMsg.includes('relatório')) {
            return this.generateDailyAnalysis(context, isPremium);
        }

        if (lowerMsg.includes('energia') || lowerMsg.includes('cansado') || lowerMsg.includes('sono') || lowerMsg.includes('preguiça')) {
            return this.generateEnergyAdvice(context, isPremium);
        }

        if (lowerMsg.includes('treino') || lowerMsg.includes('exercício') || lowerMsg.includes('hipertrofia') || lowerMsg.includes('academia') || lowerMsg.includes('força')) {
            return this.generateWorkoutAdvice(context, isPremium);
        }

        if (lowerMsg.includes('dieta') || lowerMsg.includes('comer') || lowerMsg.includes('proteína') || lowerMsg.includes('nutrição')) {
            return this.generateNutritionAdvice(context, isPremium);
        }

        if (lowerMsg.includes('foco') || lowerMsg.includes('trabalho') || lowerMsg.includes('estudar') || lowerMsg.includes('concentra')) {
            return this.generateFocusAdvice(context, isPremium);
        }

        // Default: Context-Aware General Response
        return this.generateContextualChat(context, lowerMsg, isPremium);
    }

    private static generateDailyAnalysis(ctx: AIContext, isPremium: boolean): CoachResponse {
        const { today } = ctx;

        if (!isPremium) {
            return {
                text: `
**[COACH IA BÁSICO]**
✅ Análise do Dia:
- Calorias: ${(today.nutrition.calories.consumed / today.nutrition.calories.target * 100).toFixed(0)}% da meta.
- Água: ${(today.water / 1000).toFixed(1)}L.
- Treino: ${today.workoutCompleted ? 'Feito' : 'Pendente'}.

⚠️ *Para análises profundas e correlações de dados, ative o Premium.*
                `.trim()
            };
        }

        let analysis = `
**STATUS:** Análise Diária (Premium) 💎
**INSIGHT:**
`;

        // Nutrition Analysis
        const cal = today.nutrition.calories;
        const protein = today.nutrition.protein;
        const calPercent = cal.target > 0 ? (cal.consumed / cal.target) * 100 : 0;

        if (calPercent < 80) {
            analysis += `🥗 **Nutrição:** Déficit calórico (${cal.consumed.toFixed(0)}/${cal.target.toFixed(0)} kcal). Faltam ${(protein.target - protein.consumed).toFixed(0)}g de proteína.\n`;
        } else if (calPercent > 110) {
            analysis += `🥗 **Nutrição:** Superávit calórico (${calPercent.toFixed(0)}% da meta).\n`;
        } else {
            analysis += `✅ **Nutrição:** Na meta! (${cal.consumed.toFixed(0)} kcal).\n`;
        }


        // Water Analysis
        if (today.water < today.waterTarget * 0.5) {
            analysis += `⚠️ **Hidratação:** CRÍTICA. ${(today.water / 1000).toFixed(1)}L de ${(today.waterTarget / 1000).toFixed(1)}L. Foco reduzido em ~20%.\n`;
        } else if (today.water >= today.waterTarget) {
            analysis += `✅ **Hidratação:** Otimizada. Transporte de nutrientes no pico.\n`;
        } else {
            analysis += `💧 **Hidratação:** ${(today.water / 1000).toFixed(1)}L. Faltam ${((today.waterTarget - today.water) / 1000).toFixed(1)}L.\n`;
        }

        // Workout Analysis
        if (today.workoutCompleted) {
            analysis += `🔥 **Treino:** CONCLUÍDO. Aproveite a janela anabólica.\n`;
        } else {
            analysis += `🏋️ **Treino:** PENDENTE. A consistência é o segredo.\n`;
        }

        // Routine
        analysis += `📅 **Rotina:** ${today.routineCompletion.toFixed(0)}% das tarefas concluídas.\n`;

        analysis += `
**RECOMENDAÇÃO:** Termine o dia batendo a meta de água e proteína para garantir a recuperação noturna.
**CIÊNCIA:** A recuperação do SNC ocorre predominantemente durante o sono REM.
`;

        return { text: analysis.trim() };
    }

    private static generateEnergyAdvice(ctx: AIContext, isPremium: boolean): CoachResponse {
        if (!isPremium) {
            return {
                text: `
**[COACH IA BÁSICO]**
Energia baixa pode ser falta de sono ou comida.
- Tente beber água.
- Coma uma fruta.
- Tire um cochilo breve.

⚠️ *Membros Premium recebem análise detalhada de cronobiologia.*
                `.trim()
            };
        }

        const cal = ctx.today.nutrition.calories;
        const nutritionWarning = cal.consumed < cal.target * 0.4 ? "Você comeu menos de 40% da sua meta calórica, o que explica a fadiga." : "Hidratação e sono são os prováveis culpados.";

        return {
            text: `
**STATUS:** Análise de Energia (Premium) 💎
**INSIGHT:** 
1. **Sono:** Se você dormiu menos de 7h, evite cafeína após as 14h.
2. **Nutrição:** ${nutritionWarning}
3. **Hidratação:** Nível atual: ${(ctx.today.water / 1000).toFixed(1)}L.
**RECOMENDAÇÃO:** Faça 5 minutos de respiração profunda (Box Breathing) ou coma uma fruta agora.
**CIÊNCIA:** O cérebro consome 20% da glicose do corpo, mesmo em repouso.
            `.trim()
        };
    }

    private static generateWorkoutAdvice(ctx: AIContext, isPremium: boolean): CoachResponse {
        if (!isPremium) {
            return {
                text: `
**[COACH IA BÁSICO]**
Treino é consistência.
- Se já treinou: Ótimo, descanse.
- Se não treinou: Vá treinar, foque na execução.

⚠️ *Análise de progressão de carga disponível no Premium.*
                `.trim()
            };
        }

        const trend = ctx.history.weightTrend === 'down' ? 'Perda de gordura' : 'Ganho de massa';

        if (ctx.today.workoutCompleted) {
            const protein = ctx.today.nutrition.protein;
            return {
                text: `
**STATUS:** Treino (Premium) 💎
**INSIGHT:** Você consumiu ${protein.consumed.toFixed(0)}g de proteína até agora (Meta: ${protein.target.toFixed(0)}g).
**RECOMENDAÇÃO:** Garanta que sua próxima refeição tenha pelo menos 30g de proteína para maximizar a recuperação.
**CIÊNCIA:** A síntese proteica permanece elevada por até 24h pós-treino, mas aminoácidos circulantes são essenciais.
                `.trim()
            };
        }

        return {
            text: `
**STATUS:** Treino Pendente (Premium) 💎
**INSIGHT:** Com base no seu objetivo de **${ctx.user.goal}** (${trend}), cada treino conta.
**RECOMENDAÇÃO:** Aplique a **Sobrecarga Progressiva**. Tente aumentar 1-2kg na sua série principal hoje ou melhore a execução.
**CIÊNCIA:** A tensão mecânica é o principal estímulo para hipertrofia.
            `.trim()
        };
    }

    private static generateNutritionAdvice(ctx: AIContext, isPremium: boolean): CoachResponse {
        if (!isPremium) {
            return {
                text: `
**[COACH IA BÁSICO]**
Dica de Dieta:
- Coma proteínas em todas as refeições.
- Evite ultraprocessados.
- Beba água entre as refeições.

⚠️ *Plano alimentar ajustado dinamicamente é exclusivo Premium.*
                `.trim()
            };
        }

        const remainingMeals = ctx.today.totalMeals - ctx.today.mealsCompleted;
        const n = ctx.today.nutrition;

        return {
            text: `
**STATUS:** Nutrição Inteligente (Premium) 💎
**INSIGHT:** 
- Calorias: ${n.calories.consumed.toFixed(0)} / ${n.calories.target.toFixed(0)} kcal
- Proteína: ${n.protein.consumed.toFixed(0)} / ${n.protein.target.toFixed(0)} g
- Carboidratos: ${n.carbs.consumed.toFixed(0)} / ${n.carbs.target.toFixed(0)} g

**RECOMENDAÇÃO:** Faltam ${remainingMeals} refeições. Priorize bater a meta de proteínas sem estourar as gorduras.
**CIÊNCIA:** Proteínas têm alto efeito térmico e saciedade.
            `.trim()
        };
    }

    private static generateFocusAdvice(ctx: AIContext, isPremium: boolean): CoachResponse {
        if (!isPremium) {
            return {
                text: `
**[COACH IA BÁSICO]**
Para focar:
- Elimine distrações.
- Tente focar por 25 minutos seguidos.
- Respire fundo.

⚠️ *Protocolos de neurociência disponíveis no Premium.*
                `.trim()
            };
        }

        return {
            text: `
**STATUS:** Foco Profundo (Premium) 💎
**INSIGHT:** Sua taxa de conclusão de rotina hoje é de ${ctx.today.routineCompletion.toFixed(0)}%.
**RECOMENDAÇÃO:** Use a técnica Pomodoro (25/5) para as próximas tarefas. Bloqueie notificações.
**CIÊNCIA:** O cérebro humano tem um ciclo ultradiano de foco de aproximadamente 90 minutos.
             `.trim()
        };
    }


    private static generateContextualChat(ctx: AIContext, _msg: string, isPremium: boolean): CoachResponse {
        if (!isPremium) {
            return {
                text: `
**[COACH IA BÁSICO]**
Olá ${ctx.user.name}. Sou seu assistente básico.
Para respostas personalizadas baseadas nos seus dados de dieta, treino e sono, por favor desbloqueie o acesso Premium.
                `.trim()
            };
        }

        const cal = ctx.today.nutrition.calories;

        return {
            text: `
**STATUS:** Chat Premium 💎
**INSIGHT:** Como seu Coach Axion, estou analisando seus dados em tempo real.
- Nutrição: ${cal.consumed.toFixed(0)}/${cal.target.toFixed(0)} kcal
- Hidratação: ${(ctx.today.water / 1000).toFixed(1)}L
- Treino: ${ctx.today.workoutCompleted ? '✅ Feito' : '⏳ Pendente'}
**RECOMENDAÇÃO:** Posso ajudar mais especificamente com estratégias de **Treino**, **Dieta** ou **Produtividade**?
            `.trim()
        };
    }
}
