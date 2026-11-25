import { useEffect, useState } from 'react';
import { JOURNEY_STAGES } from './data/guiaContent';
import {
  ActiveTab,
  ChatAttachment,
  ChatMessage,
  Conversation,
  JourneyStageId,
  ThemeOption,
} from './types/guia';
import {
  deriveConversationTitle,
  loadConversations,
  saveConversations,
} from './utils/conversationStorage';
import { Header } from './components/Header';
import { MobileBottomBar } from './components/MobileBottomBar';
import { ConversationSidebar } from './components/ConversationSidebar';
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

  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadConversations()
  );
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const upsertConversationMessages = (
    convId: string,
    titleIfNew: string,
    stageId: JourneyStageId,
    nextMessages: ChatMessage[]
  ) => {
    const nowIso = new Date().toISOString();
    setConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === convId);
      if (existingIndex === -1) {
        const created: Conversation = {
          id: convId,
          title: titleIfNew,
          stageId,
          messages: nextMessages,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        return [created, ...prev];
      }
      const updated: Conversation = {
        ...prev[existingIndex],
        stageId,
        messages: nextMessages,
        updatedAt: nowIso,
      };
      const rest = prev.filter((c) => c.id !== convId);
      return [updated, ...rest];
    });
  };

  const streamAssistantResponse = async (
    convId: string,
    convTitle: string,
    stageId: JourneyStageId,
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
          stage: stageId,
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
            const updatedList = [
              ...conversationUpToUser,
              {
                id: assistantMsgId,
                role: 'model' as const,
                text: accumulatedText,
                createdAt: new Date().toISOString(),
              },
            ];
            setMessages(updatedList);
            upsertConversationMessages(convId, convTitle, stageId, updatedList);
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
      const errorList: ChatMessage[] = [
        ...conversationUpToUser,
        {
          id: assistantMsgId,
          role: 'model',
          text: fallbackMsg,
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ];
      setMessages(errorList);
      upsertConversationMessages(convId, convTitle, stageId, conversationUpToUser);
    } finally {
      setIsStreaming(false);
    }
  };

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

    const convId = activeConversationId ?? `conv-${Date.now()}`;
    const convTitle =
      activeConversation?.title ?? deriveConversationTitle(text, attachments);
    if (!activeConversationId) {
      setActiveConversationId(convId);
    }

    const conversationUpToUser = [
      ...messages.filter((m) => !m.isError),
      userMsg,
    ];
    setMessages([...conversationUpToUser, placeholderAssistant]);
    upsertConversationMessages(
      convId,
      convTitle,
      selectedStageId,
      conversationUpToUser
    );

    await streamAssistantResponse(
      convId,
      convTitle,
      selectedStageId,
      conversationUpToUser,
      assistantMsgId
    );
  };

  const runRetry = async () => {
    if (isStreaming || !activeConversationId) return;
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
    const title =
      activeConversation?.title ??
      deriveConversationTitle(cleaned[0].text, cleaned[0].attachments);
    setMessages([...cleaned, placeholderAssistant]);
    await streamAssistantResponse(
      activeConversationId,
      title,
      selectedStageId,
      cleaned,
      assistantMsgId
    );
  };

  const handleNewConversation = () => {
    if (isStreaming) return;
    setActiveConversationId(null);
    setMessages([]);
    setErrorMessage(null);
  };

  const handleSelectConversation = (id: string) => {
    if (isStreaming) return;
    const found = conversations.find((c) => c.id === id);
    if (!found) return;
    setActiveConversationId(found.id);
    setSelectedStageId(found.stageId);
    setMessages(found.messages);
    setErrorMessage(null);
    setActiveTab('chat');
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
      setErrorMessage(null);
    }
  };

  const handleClearAllConversations = () => {
    if (isStreaming) return;
    setConversations([]);
    setActiveConversationId(null);
    setMessages([]);
    setErrorMessage(null);
  };

  const handleAskFromGuide = (prompt: string) => {
    setActiveTab('chat');
    setActiveConversationId(null);
    setMessages([]);
    void sendMessage(prompt, []);
  };

  const isChatTab = activeTab === 'chat';

  return (
    <div
      className={`flex flex-col bg-[var(--lia-canvas)] text-[var(--lia-ink)] pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0 ${
        isChatTab ? 'h-dvh overflow-hidden' : 'min-h-dvh'
      }`}
    >
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
      />

      <main
        className={`flex-1 flex flex-col min-w-0 ${
          isChatTab ? 'min-h-0 overflow-hidden' : ''
        }`}
      >
        <FirstVisitPWABanner />

        {isChatTab && (
          <div className="flex-1 flex min-h-0 min-w-0">
            <ConversationSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              stages={JOURNEY_STAGES}
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onClearAllConversations={handleClearAllConversations}
            />

            <ChatWorkspace
              stages={JOURNEY_STAGES}
              selectedStageId={selectedStageId}
              onSelectStage={setSelectedStageId}
              conversationTitle={activeConversation?.title ?? null}
              savedCount={conversations.length}
              messages={messages}
              isStreaming={isStreaming}
              errorMessage={errorMessage}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
              onSendMessage={(text, atts) => void sendMessage(text, atts)}
              onRetryLastMessage={() => void runRetry()}
              onNewConversation={handleNewConversation}
              onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
            />
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
            hasMessages={messages.length > 0 || conversations.length > 0}
            onClearConversation={handleClearAllConversations}
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
