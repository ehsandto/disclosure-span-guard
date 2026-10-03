# Builder submission

Contribution type: **Builder → Intelligent Contracts**

Title: **DisclosureSpanGuard — Consensus-Grounded Document Redaction**

Notes / Description (under 1,000 characters):

> DisclosureSpanGuard is a reusable GenLayer public-document transformation primitive. A caller binds a GitHub file at a full commit and SHA-256, selecting personal-only or all-email redaction. Leader and validators independently fetch the bytes, check HTTP status, hash and UTF-8, derive exact email spans, and semantically distinguish named personal contacts from shared role mailboxes. Exact canonical report equality covers source observations, every label, redacted bytes and output hash. Unknown labels, bad commitments and missing sources store HELD with no output; a complete agreeing vector stores immutable RELEASED text and a job- and contract-bound root. StudioNet proofs show personal-only masking, all-contact masking, wrong-hash and 404 fail-closed paths, plus replay rejection. GenVM lint/SDK validation and seven direct tests pass. This filters standard email addresses in public documents; it does not detect every kind of personal data.

Evidence URLs (paste separately):

1. https://github.com/ehsandto/disclosure-span-guard
2. https://github.com/ehsandto/disclosure-span-guard/blob/main/contracts/DisclosureSpanGuard.py
3. https://github.com/ehsandto/disclosure-span-guard/blob/main/LIVE_PROOFS.md
4. https://explorer-studio.genlayer.com/address/0x745Cb831be8650af7e2F8A1CF13bFB64679C0D75
5. https://explorer-studio.genlayer.com/tx/0x2bdadfa72250354f180fd8550bd828c4a66ea0832c7223b49497e2fb2c7bf5e2
6. https://explorer-studio.genlayer.com/tx/0x442f9ebb419bddce3b613d89e50cfe8e156a8098000a298cf392be47f4d62ee5
7. https://explorer-studio.genlayer.com/tx/0x86d7f9e554cf8deb489a2df72ffdd6d91fb9fa0790b66957993e25e3e01826ae
8. https://explorer-studio.genlayer.com/tx/0xda85aa85db309fb9670d6c6eb6c351c546c61f061c6c9607192e6cbb04367e7b
9. https://explorer-studio.genlayer.com/tx/0xd7d782b476111319085883d5ca9b721add670b2865bcebc17b4c7862722f5abb
