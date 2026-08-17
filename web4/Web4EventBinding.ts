import { Web4Event, EventCallback } from '../types';
import { WebSocketProvider, WSProviderConfig } from './WebSocketProvider';

export class Web4EventBinding {
  private provider: WebSocketProvider;
  private subscriptions: Map<string, Set<EventCallback>> = new Map();

  constructor(
    private readonly nodeId: string,
    config: WSProviderConfig
  ) {
    // Route incoming WebSocket frames to registered channel callbacks
    this.provider = new WebSocketProvider(config, (event) => this.handleIncomingEvent(event));
  }

  public async connect(): Promise<void> {
    await this.provider.connect();
  }

  public subscribe<T = Record<string, unknown>>(channel: string, callback: EventCallback<T>): void {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)!.add(callback as EventCallback);
  }

  public async emit<T = Record<string, unknown>>(channel: string, payload: T): Promise<Web4Event<T>> {
    const event: Web4Event<T> = {
      id: crypto.randomUUID(),
      channel,
      sender: this.nodeId,
      timestamp: Date.now(),
      payload
    };

    // 1. Broadcast over real network socket
    this.provider.send(event);

    // 2. Dispatch locally for immediate subscriber feedback
    await this.dispatchLocal(event);

    return event;
  }

  private async handleIncomingEvent(event: Web4Event): Promise<void> {
    // Ignore self-emitted frames echoing back from relay
    if (event.sender === this.nodeId) return;
    await this.dispatchLocal(event);
  }

  private async dispatchLocal(event: Web4Event): Promise<void> {
    const handlers = this.subscriptions.get(event.channel);
    if (handlers) {
      await Promise.all(Array.from(handlers).map((fn) => fn(event)));
    }
  }

  public disconnect(): void {
    this.provider.disconnect();
  }
}
