# StudioNet live proofs

Contract: [`0x745Cb831be8650af7e2F8A1CF13bFB64679C0D75`](https://explorer-studio.genlayer.com/address/0x745Cb831be8650af7e2F8A1CF13bFB64679C0D75)

Deployment source normalized SHA-256: `d49e90cf279afba7a3479de185f7c0fd44abfdf28e89030889f79fea8d1fa921`. `node scripts/verify_source.mjs 0x745Cb831be8650af7e2F8A1CF13bFB64679C0D75` confirmed deployed source equals `contracts/DisclosureSpanGuard.py` after CRLF normalization.

All links below are finalized. Success means the leader execution succeeded; a finalized error is explicitly marked as such. Consensus result was `MAJORITY_AGREE`, not a claim of unanimous validator execution. The contract's validator callback independently fetches the same source and reclassifies every candidate; it accepts only an exact canonical report match.

| Case | Transaction | Verified outcome |
| --- | --- | --- |
| Deploy | [0x35b76165…25ffdb](https://explorer-studio.genlayer.com/tx/0x35b761652428ab0fe3830dbd7b24a44e5b3ef06d563cd2a6bd9894d02d25ffdb) | Successful contract creation. |
| Personal-only | [0x2bdadfa7…f5e2](https://explorer-studio.genlayer.com/tx/0x2bdadfa72250354f180fd8550bd828c4a66ea0832c7223b49497e2fb2c7bf5e2) | `RELEASED`; labels `PERSONAL, ROLE, PERSONAL`; two addresses masked and shared `security@example.org` retained. Output hash `3ebd6fd7e7c0035b49d96c2439870b0f3e7ce3d424f1611c08fe26568ed629b5`. |
| All contacts | [0x442f9ebb…62ee5](https://explorer-studio.genlayer.com/tx/0x442f9ebb419bddce3b613d89e50cfe8e156a8098000a298cf392be47f4d62ee5) | `RELEASED`; same three labels, all three addresses masked. Output hash `d99309c46e41c1c3547e85e4369105ec7345d725b61df162d680de22d588f411`. |
| Wrong commitment | [0x86d7f9e5…826ae](https://explorer-studio.genlayer.com/tx/0x86d7f9e554cf8deb489a2df72ffdd6d91fb9fa0790b66957993e25e3e01826ae) | `HELD`; HTTP 200 but `hash_match=false`; output empty. |
| Missing source | [0xda85aa85…7e7b](https://explorer-studio.genlayer.com/tx/0xda85aa85db309fb9670d6c6eb6c351c546c61f061c6c9607192e6cbb04367e7b) | `HELD`; HTTP 404, output empty. |
| Replay | [0xd7d782b4…5abb](https://explorer-studio.genlayer.com/tx/0xd7d782b476111319085883d5ca9b721add670b2865bcebc17b4c7862722f5abb) | Finalized **execution error**, expected `invalid or reused job`; original artifact unchanged. |

## Source binding

The synthetic public [demo document](https://github.com/ehsandto/disclosure-span-guard/blob/ca1723c2db984382d2185da564ac18863f5ee6f1/examples/incident.txt) was fetched at full commit `ca1723c2db984382d2185da564ac18863f5ee6f1`, with full-body SHA-256 `a156dfe69d85460113a948d4861272bdc099a99194dcce1285a7e8605423d5bc`. The two successful reports each recorded HTTP 200 and a matching hash. The demo illustrates transformation behavior; it is not evidence of an actual private-data leak.

## Boundaries

This version filters ordinary email syntax in public documents only. It does not guarantee detection of all identifiers or correct semantic labeling. `PERSONAL` release depends on exact validator agreement about each label. A disagreement stops the state transition; it does not prove which classifier was right. No privacy vault, real service settlement, token custody, or downstream execution is claimed.
