Here is the complete implementation of a real WebSocket transport provider (`WebSocketProvider`) integrated with `Web4EventBinding`, featuring automatic reconnection, heartbeat keep-alive, and channel multiplexing.

### 1. WebSocket Transport Provider (`src/web4/WebSocketProvider.ts`)

```typescript
import WebSocket from 'ws'; // Uses 'ws' in Node.js or native WebSocket in browser environments
import { Web4Event } from '../types';

export interface WSProviderConfig {
  url: string;
  reconnectIntervalMs?: number;
  maxReconnectAttempts?: number;
  pingIntervalMs?: number;
}

export class WebSocketProvider {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private pingTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly config: WSProviderConfig,
    private readonly onMessageCallback: (event: Web4Event) => void
  ) {}

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          console.log(`[WSProvider] Connected to Web4 relay: ${this.config.url}`);
          resolve();
        };

        this.ws.onmessage = (event: WebSocket.MessageEvent) => {
          try {
            const parsed = JSON.parse(event.data.toString()) as Web4Event;
            if (parsed && parsed.channel) {
              this.onMessageCallback(parsed);
            }
          } catch (err) {
            console.error('[WSProvider] Failed to parse incoming frame:', err);
          }
        };

        this.ws.onerror = (error: WebSocket.ErrorEvent) => {
          console.error('[WSProvider] Socket error:', error.message || error);
          if (!this.isConnected) reject(error);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.stopHeartbeat();
          console.warn('[WSProvider] Connection closed.');
          this.handleReconnect();
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  public send(event: Web4Event): void {
    if (!this.isConnected || !this.ws) {
      throw new Error('[WSProvider] Cannot send event: WebSocket is disconnected.');
    }
    this.ws.send(JSON.stringify(event));
  }

  private handleReconnect(): void {
    const maxAttempts = this.config.maxReconnectAttempts ?? 10;
    const interval = this.config.reconnectIntervalMs ?? 3000;

    if (this.reconnectAttempts < maxAttempts) {
      this.reconnectAttempts++;
      console.log(`[WSProvider] Reconnecting (${this.reconnectAttempts}/${maxAttempts}) in ${interval}ms...`);
      setTimeout(() => this.connect().catch(() => {}), interval);
    } else {
      console.error('[WSProvider] Max reconnection attempts reached.');
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    const interval = this.config.pingIntervalMs ?? 30000;
    this.pingTimer = setInterval(() => {
      if (this.ws && this.isConnected) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, interval);
  }

  private stopHeartbeat(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  public disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

```

---

### 2. Updated Web4 Event Binding (`src/web4/Web4EventBinding.ts`)

```typescript
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

```

---

### 3. Usage & Bootstrapping (`src/index.ts`)

```typescript
import { Web4EventBinding } from './web4/Web4EventBinding';

async function main() {
  const web4 = new Web4EventBinding('lamis-node-01', {
    url: 'wss://relay.qubuhub.org/web4/v1',
    reconnectIntervalMs: 2000,
    maxReconnectAttempts: 5
  });

  // Subscribe to Web4 network channels
  web4.subscribe('agent:input', async (event) => {
    console.log(`[Channel: agent:input] Received from ${event.sender}:`, event.payload);
  });

  await web4.connect();

  // Publish event to Web4 network
  await web4.emit('agent:input', { text: 'Execute task paper #42' });
}

main().catch(console.error);

```
