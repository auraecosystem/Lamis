export interface Web4Event<T = Record<string, unknown>> {
  id: string;
  channel: string;
  sender: string;
  timestamp: number;
  payload: T;
  signature?: string;
}

export interface AgentContext {
  sessionId: string;
  systemPrompt: string;
  memoryWindow: Array<{ role: 'user' | 'assistant' | 'tool'; content: string }>;
  metadata: Map<string, unknown>;
}

export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
}

export interface Tool {
  name: string;
  description: string;
  execute: (args: Record<string, unknown>, ctx: AgentContext) => Promise<ToolResult>;
}

export type EventCallback<T = Record<string, unknown>> = (event: Web4Event<T>) => Promise<void>;
