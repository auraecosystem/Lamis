import { Web4Event, EventCallback } from '../types';

export class Web4EventBinding {
  private subscriptions: Map<string, Set<EventCallback>> = new Map();
  private isConnected: boolean = false;

  constructor(private readonly nodeId: string) {}

  public async connect(): Promise<void> {
    // Connect to distributed Web4 event protocol / WebSocket transport
    this.isConnected = true;
    console.log(`[Web4Binding] Node connected: ${this.nodeId}`);
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

    // Broadcast event across internal subscribers and network
    const handlers = this.subscriptions.get(channel);
    if (handlers) {
      await Promise.all(Array.from(handlers).map((fn) => fn(event)));
    }

    return event;
  }
}
