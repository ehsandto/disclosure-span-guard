import fs from 'node:fs';
import crypto from 'node:crypto';
import dns from 'node:dns';

const address = process.argv[2];
if (!/^0x[0-9a-fA-F]{40}$/.test(address ?? '')) throw Error('Contract address required');
dns.setDefaultResultOrder('ipv4first');
let payload;
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    const response = await fetch('https://studio.genlayer.com/api', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'gen_getContractCode', params: [address]}),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    payload = await response.json();
    break;
  } catch (error) {
    if (attempt === 2) throw error;
  }
}
if (payload.error || typeof payload.result !== 'string') throw Error(JSON.stringify(payload.error));
const normalize = text => text.replace(/\r\n/g, '\n').trimEnd() + '\n';
const deployed = normalize(Buffer.from(payload.result, 'base64').toString('utf8'));
const local = normalize(fs.readFileSync('contracts/DisclosureSpanGuard.py', 'utf8'));
const match = deployed === local;
console.log(JSON.stringify({address, match, sha256: crypto.createHash('sha256').update(deployed).digest('hex')}));
if (!match) process.exitCode = 1;
