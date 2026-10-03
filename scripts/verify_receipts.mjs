import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');
const proofs = [
  ['deploy', '0x35b761652428ab0fe3830dbd7b24a44e5b3ef06d563cd2a6bd9894d02d25ffdb', 'SUCCESS'],
  ['personal', '0x2bdadfa72250354f180fd8550bd828c4a66ea0832c7223b49497e2fb2c7bf5e2', 'SUCCESS'],
  ['all', '0x442f9ebb419bddce3b613d89e50cfe8e156a8098000a298cf392be47f4d62ee5', 'SUCCESS'],
  ['wrong-hash', '0x86d7f9e554cf8deb489a2df72ffdd6d91fb9fa0790b66957993e25e3e01826ae', 'SUCCESS'],
  ['missing-source', '0xda85aa85db309fb9670d6c6eb6c351c546c61f061c6c9607192e6cbb04367e7b', 'SUCCESS'],
  ['replay', '0xd7d782b476111319085883d5ca9b721add670b2865bcebc17b4c7862722f5abb', 'ERROR'],
];

async function transaction(hash) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch('https://studio.genlayer.com/api', {
        method: 'POST', headers: {'content-type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'eth_getTransactionByHash', params: [hash]}),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (payload.error || !payload.result) throw Error(JSON.stringify(payload.error));
      return payload.result;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
}

for (const [name, hash, expected] of proofs) {
  const tx = await transaction(hash);
  const leader = tx.consensus_data?.leader_receipt?.find(item => item.mode === 'leader');
  const ok = tx.status === 'FINALIZED' && leader?.execution_result === expected;
  console.log(JSON.stringify({name, hash, finalized: tx.status === 'FINALIZED',
    leader_execution: leader?.execution_result, consensus: tx.result_name, ok}));
  if (!ok) process.exitCode = 1;
}
