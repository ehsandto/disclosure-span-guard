# DisclosureSpanGuard

A GenLayer primitive that publishes an immutable, source-bound redacted document. Its output is transformed text, not a certificate, graph update, or permission gate.

## Problem

Public reports may contain both an individual's email and shared team mailboxes. A regex can find addresses but cannot reliably decide which address is a personal contact and which is an organizational role. A single off-chain classifier can silently mislabel either. DisclosureSpanGuard makes that distinction a GenLayer consensus decision against the same fetched source.

## Workflow

1. A caller specifies a public GitHub owner, repository, full commit, file path, SHA-256 of the **complete original bytes**, and policy (`PERSONAL` or `ALL`).
2. Leader and validators separately fetch the pinned raw file. Each checks HTTP status, byte limit, full-body hash, UTF-8, and the same deterministic email spans.
3. Each independently classifies every observed email as `PERSONAL`, `ROLE`, or `UNKNOWN` from its context. Exact canonical report equality is required, including every decision-bearing label and output byte.
4. The contract constructs the redacted document from source positions. Any unknown label, broken commitment, missing source, or invalid response becomes `HELD` with no output. Agreement on a complete vector stores `RELEASED` output and an immutable report root.

```text
pinned upstream bytes → independent fetch/hash → deterministic spans
                    → independent semantic labels → exact report consensus
                    → redacted text + immutable root, or HELD
```

The `PERSONAL` policy replaces personal addresses and preserves verified shared role addresses. `ALL` replaces every email after classification. The semantic classification affects the published bytes under `PERSONAL`.

## Public methods

- `transform(job_id, owner, repo, commit, path, expected_hash, mode)` — permissionless one-shot transformation; IDs cannot be reused.
- `get_artifact(job_id)` — complete report, redacted output when released, source commitment, classification vector, and root.

## Security and limits

- Only `raw.githubusercontent.com` URLs constructed in-contract from constrained path segments are fetched. Full commit IDs prevent mutable branch substitution.
- Original text is **already public** at its source and visible to validators. This is a public-content display filter, not a privacy vault.
- This version covers standard email syntax in documents up to 8 KiB and at most 24 addresses. It does not detect obfuscated emails, phone numbers, postal addresses, or all personal information.
- A model can still misclassify an address if validators agree on a wrong result. Exact agreement reduces unilateral error; it is not a correctness guarantee.
- If validator consensus fails, the transaction does not store an output. The caller may retry with a fresh ID.
- A matching hash authenticates bytes relative to the caller's commitment; it does not prove the source publisher is trustworthy. Consumers must decide whether they trust that publisher.

## Development

Install `genlayer-test`, `genvm-linter`, and the GenLayer CLI. Run `genvm-lint check contracts/DisclosureSpanGuard.py` and `pytest tests -q`. Set CLI network to `studionet`, then deploy with `genlayer deploy --contract contracts/DisclosureSpanGuard.py`. The `examples/incident.txt` file is a synthetic demo, not a real leaked document.

See `LIVE_PROOFS.md` for verified Explorer transactions after deployment. Do not treat a finalized transaction as a successful execution without checking its receipt.
