export type JourneyStageId =
  | 'planejamento'
  | 'gestacao'
  | 'parto_pos_parto'
  | 'recem_nascido'
  | 'bebe_1_12m'
  | 'primeiros_anos';

export type ActiveTab = 'chat' | 'guides' | 'alerts' | 'sources' | 'settings';

export type ThemeOption = 'blue' | 'pink';

export interface JourneyStage {
  id: JourneyStageId;
  label: string;
  shortLabel: string;
  ageRange: string;
  summary: string;
  starterQuestions: string[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  mimeType: string;
  data: string; // base64 without data URL prefix (empty when stripped for localStorage)
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: ChatAttachment[];
  createdAt: string;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  stageId: JourneyStageId;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface PracticalGuide {
  id: string;
  title: string;
  category: string;
  sourceLabel: string;
  summary: string;
  imageUrl?: string;
  imageAlt?: string;
  keyPoints: string[];
  promptForGuia: string;
}

export interface EmergencyChannel {
  id: string;
  name: string;
  number: string;
  telHref: string;
  whenToCall: string;
  note: string;
}

export interface WarningSignGroup {
  id: string;
  title: string;
  subtitle: string;
  actionText: string;
  signs: string[];
}
