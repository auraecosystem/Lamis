import { AgentContext, Tool, ToolResult } from '../types';
import { MemoryBuffer } from '../memory/MemoryBuffer';
import { Web4EventBinding } from '../web4/Web4EventBinding';

export class AgentLoop {
  private tools: Map<string, Tool> = new Map();
  private isRunning: boolean = false;

  constructor(
    private readonly memory: MemoryBuffer,
    private readonly web4: Web4EventBinding
  ) {}

  public registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  public async start(): Promise<void> {
    this.isRunning = true;
    console.log('[LamisAgent] Agent loop active.');

    // Bind Web4 event triggers directly into the observation cycle
    this.web4.subscribe('agent:input', async (event) => {
      if (!this.isRunning) return;
      const prompt = String(event.payload.text || '');
      await this.step(prompt);
    });
  }

  public async step(inputPrompt: string): Promise<string> {
    this.memory.push('user', inputPrompt);
    const ctx = this.memory.getContext();

    // 1. Observe & Plan
    console.log(`[LamisAgent] Processing input: "${inputPrompt}"`);
    
    // 2. Execute Decision / Tool Routing (Mock evaluation)
    const assistantResponse = await this.evaluate(ctx);

    // 3. Persist and Emit State Update back to Web4 Network
    this.memory.push('assistant', assistantResponse);
    await this.web4.emit('agent:output', {
      sessionId: ctx.sessionId,
      response: assistantResponse
    });

    return assistantResponse;
  }

  private async evaluate(ctx: AgentContext): Promise<string> {
    // Custom model inference or agent decision loop goes here
    const lastUserMsg = ctx.memoryWindow[ctx.memoryWindow.length - 1]?.content || '';
    
    if (lastUserMsg.includes('ping')) {
      return 'pong';
    }
    
    return `Processed state for session ${ctx.sessionId} with ${ctx.memoryWindow.length} memory turns.`;
  }

  public stop(): void {
    this.isRunning = false;
    console.log('[LamisAgent] Agent loop stopped.');
  }
}
