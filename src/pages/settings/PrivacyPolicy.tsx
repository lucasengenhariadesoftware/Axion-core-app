import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PrivacyPolicy() {
    const [, setLocation] = useLocation();

    return (
        <div className="container" style={{ padding: '24px', paddingBottom: '100px', background: 'var(--color-surface)', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
                <button
                    onClick={() => setLocation('/app/profile')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px', color: 'var(--color-text-main)' }}
                >
                    <ChevronLeft size={28} />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-main)' }}>Política de Privacidade</h1>
            </div>

            <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '14px' }}>

                <p style={{ marginBottom: '24px' }}>
                    Esta Política de Privacidade descreve como o <strong>Axion Core</strong> ("aplicativo") coleta, usa, armazena e protege suas informações.
                    Ao utilizar nosso aplicativo, você concorda com as práticas descritas nesta política.
                </p>

                <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '32px' }}>
                    Última atualização: 12 de Março de 2026
                </p>

                <Section title="1. Coleta e Armazenamento de Dados">
                    <p>
                        O Axion Core adota uma abordagem <strong>"Local-First"</strong>. Isso significa que a maioria dos dados gerados por você
                        é armazenada exclusivamente no armazenamento interno do seu dispositivo.
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Dados de Saúde:</strong> Peso, altura, data de nascimento, gênero e registros de treino são salvos no seu aparelho.</li>
                        <li><strong>Fotos:</strong> Fotos de progresso são armazenadas na galeria local do seu dispositivo ou no armazenamento isolado do app.</li>
                    </ul>
                </Section>

                <Section title="2. Uso de Inteligência Artificial (IA)">
                    <p>
                        O recurso "Coach IA" utiliza algoritmos de inteligência artificial para fornecer análises personalizadas sobre seu treino e nutrição.
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Processamento:</strong> Dados como calorias consumidas e treinos realizados podem ser processados por modelos de IA para gerar feedback.</li>
                        <li><strong>Privacidade:</strong> Nenhum dado pessoal identificável (como nome real completo ou endereço) é compartilhado com terceiros para fins de treinamento de modelos sem o seu consentimento explícito.</li>
                    </ul>
                </Section>

                <Section title="3. Publicidade (AdMob)">
                    <p>
                        A versão gratuita do aplicativo exibe anúncios fornecidos pelo <strong>Google AdMob</strong> para manter o serviço acessível.
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Identificadores:</strong> O AdMob pode usar o ID de Publicidade do seu dispositivo para exibir anúncios relevantes.</li>
                        <li><strong>Coleta de Dados:</strong> O Google pode coletar dados de uso e localização aproximada conforme descrito na <a href="https://policies.google.com/privacy" target="_blank" style={{ color: 'var(--color-primary)' }}>Política de Privacidade do Google</a>.</li>
                    </ul>
                </Section>

                <Section title="4. Assinaturas e Pagamentos">
                    <p>
                        Oferecemos assinaturas "Premium" através do sistema de faturamento do <strong>Google Play</strong> (Google Play Billing).
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Segurança:</strong> O Axion Core <strong>não</strong> processa nem armazena números de cartão de crédito. Todas as transações são geridas pelo Google.</li>
                        <li><strong>Cancelamento:</strong> Você pode gerenciar ou cancelar sua assinatura a qualquer momento através das configurações da Play Store.</li>
                    </ul>
                </Section>

                <Section title="5. Reprodutor de Música e Arquivos de Áudio">
                    <p>
                        O aplicativo possui um recurso de "Music Player" interno que permite ouvir músicas durante o treino.
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Processamento Local:</strong> Qualquer arquivo de áudio selecionado por você é copiado e armazenado <strong>apenas no banco de dados interno</strong> (IndexedDB) do seu dispositivo móvel associado ao aplicativo.</li>
                        <li><strong>Sem Upload:</strong> Seus arquivos de áudio, músicas ou gravações <strong>nunca</strong> são enviados, transferidos ou copiados para nossos servidores ou para a nuvem.</li>
                    </ul>
                </Section>

                <Section title="6. Permissões do Dispositivo">
                    <p>O aplicativo pode solicitar as seguintes permissões:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Câmera e Galeria:</strong> Para permitir que você adicione fotos ao seu perfil ou diário de evolução.</li>
                        <li><strong>Notificações:</strong> Para lembretes de rotina, treinos e relatórios semanais.</li>
                        <li><strong>Músicas e Áudio:</strong> O app acessa arquivos de áudio locais para permitir que você os importe e salve de forma privada no aplicativo para reprodução durante o treino.</li>
                    </ul>
                </Section>

                <Section title="7. Exclusão de Dados">
                    <p>
                        Você tem total controle sobre seus dados.
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Sair/Resetar:</strong> A opção "Logout" ou "Resetar Dados" nas configurações apaga todos os dados armazenados localmente pelo aplicativo.</li>
                        <li><strong>Desinstalação:</strong> Ao desinstalar o aplicativo, todos os dados locais são removidos permanentemente pelo sistema operacional.</li>
                        <li><strong>Solicitação:</strong> Como não mantemos servidores com contas de usuários, não possuímos dados remotos para excluir mediante solicitação.</li>
                    </ul>
                </Section>

                <Section title="8. Contato">
                    <p>
                        Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail:
                    </p>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 700, marginTop: '8px' }}>
                        lucase.silvasoares1@gmail.com
                    </p>
                </Section>

            </div>
        </div>
    );
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '12px' }}>
            {title}
        </h2>
        {children}
    </div>
);
