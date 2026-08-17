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
