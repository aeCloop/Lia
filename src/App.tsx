import { useEffect, useState } from 'react';
import { JOURNEY_STAGES } from './data/guiaContent';
import {
  ActiveTab,
  ChatAttachment,
  ChatMessage,
  JourneyStageId,
  ThemeOption,
} from './types/guia';
import { Header } from './components/Header';
import { MobileBottomBar } from './components/MobileBottomBar';
import { StageSelectorPanel } from './components/StageSelectorPanel';
import { ChatWorkspace } from './components/ChatWorkspace';
import { PracticalGuidesView } from './components/PracticalGuidesView';
import { AlertsView } from './components/AlertsView';
import { SourcesAndRightsView } from './components/SourcesAndRightsView';
import { SettingsView } from './components/SettingsView';
import { EmergencyModal } from './components/EmergencyModal';
import {
  FirstVisitPWABanner,
  OfflineIndicator,
} from './components/PWAInstallBanner';

const THEME_STORAGE_KEY = 'lia_theme';

function getInitialTheme(): ThemeOption {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'pink' || saved === 'blue') {
      return saved;
    }
  } catch {
    // Ignore storage failures
  }
  return 'blue';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [theme, setTheme] = useState<ThemeOption>(getInitialTheme);
  const [selectedStageId, setSelectedStageId] =
    useState<JourneyStageId>('gestacao');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        theme === 'pink' ? '#B03A6E' : '#1D5B9E'
      );
    }
  }, [theme]);

  const sendMessage = async (text: string, attachments: ChatAttachment[]) => {
    if (isStreaming) return;
    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      attachments: attachments.length > 0 ? attachments : undefined,
      createdAt: new Date().toISOString(),
    };

    const assistantMsgId = `model-${Date.now() + 1}`;
    const placeholderAssistant: ChatMessage = {
      id: assistantMsgId,
      role: 'model',
      text: '',
      createdAt: new Date().toISOString(),
    };

    const conversationUpToUser = [
      ...messages.filter((m) => !m.isError),
      userMsg,
    ];
    setMessages([...conversationUpToUser, placeholderAssistant]);
    await streamAssistantResponse(conversationUpToUser, assistantMsgId);
  };

  const runRetry = async () => {
    if (isStreaming) return;
    setErrorMessage(null);
    const cleaned = messages.filter((m) => !m.isError);
    if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') {
      return;
    }
    const assistantMsgId = `model-${Date.now()}`;
    const placeholderAssistant: ChatMessage = {
      id: assistantMsgId,
      role: 'model',
      text: '',
      createdAt: new Date().toISOString(),
    };
    setMessages([...cleaned, placeholderAssistant]);
    await streamAssistantResponse(cleaned, assistantMsgId);
  };

  const streamAssistantResponse = async (
    conversationUpToUser: ChatMessage[],
    assistantMsgId: string
  ) => {
    const historyForApi = conversationUpToUser.map((msg) => ({
      role: msg.role,
      text: msg.text,
      attachments: msg.attachments?.map((att) => ({
        name: att.name,
        mimeType: att.mimeType,
        data: att.data,
      })),
    }));

    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: selectedStageId,
          messages: historyForApi,
        }),
      });

      if (!response.ok) {
        let errText =
          'Não consegui responder agora. Tente novamente em instantes.';
        try {
          const errJson = (await response.json()) as { error?: string };
          if (errJson.error) errText = errJson.error;
        } catch {
          // Keep default error text
        }
        throw new Error(errText);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Não foi possível abrir o fluxo de resposta.');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const line = event
            .split('\n')
            .find((l) => l.startsWith('data: '));
          if (!line) continue;

          const payloadStr = line.slice(6).trim();
          if (!payloadStr) continue;

          const parsed = JSON.parse(payloadStr) as {
            text?: string;
            error?: string;
            done?: boolean;
          };

          if (parsed.error) {
            throw new Error(parsed.error);
          }

          if (parsed.text) {
            accumulatedText += parsed.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, text: accumulatedText } : m
              )
            );
          }
        }
      }

      if (!accumulatedText.trim()) {
        throw new Error(
          'A resposta veio vazia. Tente reformular sua pergunta.'
        );
      }
    } catch (err) {
      const fallbackMsg =
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao conversar com a Lia.';
      setErrorMessage(fallbackMsg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, text: fallbackMsg, isError: true }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleAskFromGuide = (prompt: string) => {
    setActiveTab('chat');
    void sendMessage(prompt, []);
  };

  const handleClearConversation = () => {
    if (isStreaming) return;
    setMessages([]);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--lia-canvas)] text-[var(--lia-ink)] pb-20 md:pb-0">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
      />

      <main className="flex-1">
        <FirstVisitPWABanner />

        {activeTab === 'chat' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="hidden lg:block lg:col-span-4">
                <StageSelectorPanel
                  stages={JOURNEY_STAGES}
                  selectedStageId={selectedStageId}
                  onSelectStage={setSelectedStageId}
                  onPickQuestion={(q) => void sendMessage(q, [])}
                />
              </div>

              <div className="lg:col-span-8">
                <ChatWorkspace
                  stages={JOURNEY_STAGES}
                  selectedStageId={selectedStageId}
                  onSelectStage={setSelectedStageId}
                  messages={messages}
                  isStreaming={isStreaming}
                  errorMessage={errorMessage}
                  onSendMessage={(text, atts) => void sendMessage(text, atts)}
                  onRetryLastMessage={() => void runRetry()}
                  onClearConversation={handleClearConversation}
                  onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <PracticalGuidesView onAskLia={handleAskFromGuide} />
        )}

        {activeTab === 'alerts' && <AlertsView />}

        {activeTab === 'sources' && <SourcesAndRightsView />}

        {activeTab === 'settings' && (
          <SettingsView
            theme={theme}
            onChangeTheme={setTheme}
            hasMessages={messages.length > 0}
            onClearConversation={handleClearConversation}
          />
        )}
      </main>

      <MobileBottomBar activeTab={activeTab} onSelectTab={setActiveTab} />

      <OfflineIndicator />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onGoToAlerts={() => setActiveTab('alerts')}
      />
    </div>
  );
}
