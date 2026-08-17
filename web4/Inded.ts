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
