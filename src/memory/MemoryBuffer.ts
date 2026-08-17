import { AgentContext } from '../types';

export class MemoryBuffer {
  private context: AgentContext;

  constructor(sessionId: string, systemPrompt: string, private readonly maxWindowSize: number = 20) {
    this.context = {
      sessionId,
      systemPrompt,
      memoryWindow: [],
      metadata: new Map()
    };
  }

  public push(role: 'user' | 'assistant' | 'tool', content: string): void {
    this.context.memoryWindow.push({ role, content });
    if (this.context.memoryWindow.length > this.maxWindowSize) {
      this.context.memoryWindow.shift(); // Evict oldest turn
    }
  }

  public getContext(): AgentContext {
    return { ...this.context };
  }

  public setMeta(key: string, value: unknown): void {
    this.context.metadata.set(key, value);
  }
}
