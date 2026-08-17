import { Web4EventBinding } from './web4/Web4EventBinding';
import { MemoryBuffer } from './memory/MemoryBuffer';
import { AgentLoop } from './agent/AgentLoop';

async function bootstrap() {
  // Initialize Web4 Event Layer
  const web4 = new Web4EventBinding('lamis-node-alpha');
  await web4.connect();

  // Initialize Memory & Agent Loop
  const memory = new MemoryBuffer('sess_001', 'You are the Lamis Agent for Aura Ecosystem.');
  const agent = new AgentLoop(memory, web4);

  // Register Custom Agent Tool
  agent.registerTool({
    name: 'node_status',
    description: 'Retrieves Web4 cluster health status',
    execute: async () => ({ success: true, data: { status: 'HEALTHY', peers: 12 } })
  });

  // Start Agent Loop
  await agent.start();

  // Test Web4 Trigger
  await web4.emit('agent:input', { text: 'ping' });
}

bootstrap().catch(console.error);
