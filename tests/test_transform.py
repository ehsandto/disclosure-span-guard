import hashlib
import json


BODY = ("Incident notice: maintainer Maya Chen may be reached at maya.chen@example.org. "
        "The shared response desk is security@example.org. "
        "For this exercise, reviewer Theo Park uses theo.park@example.org.\n")
COMMIT = "a" * 40


def run(c, vm, job="case", body=BODY, expected=None, labels=None, status=200, mode="PERSONAL"):
    data = body.encode()
    vm.clear_mocks()
    vm.mock_web(r".*raw\.githubusercontent\.com.*", {"status": status, "body": data})
    vm.mock_llm(r"(?s).*Classify every indexed email address.*",
                json.dumps({"labels": labels or ["PERSONAL", "ROLE", "PERSONAL"]}))
    c.transform(job, "ehsandto", "disclosure-span-guard", COMMIT, "examples/incident.txt",
                expected or hashlib.sha256(data).hexdigest(), mode)
    return c.get_artifact(job)


def test_personal_contacts_are_replaced_and_role_preserved(direct_vm, direct_deploy, direct_alice):
    c = direct_deploy("contracts/DisclosureSpanGuard.py")
    direct_vm.sender = direct_alice
    result = run(c, direct_vm)
    assert result["status"] == "RELEASED", (result["spans"], result["labels"])
    assert result["output"].count("[REDACTED_EMAIL]") == 2
    assert "security@example.org" in result["output"]
    assert "maya.chen@example.org" not in result["output"]
    assert hashlib.sha256(result["output"].encode()).hexdigest() == result["output_hash"]
    assert len(result["root"]) == 64


def test_semantic_classification_changes_output(direct_vm, direct_deploy, direct_alice):
    c = direct_deploy("contracts/DisclosureSpanGuard.py")
    direct_vm.sender = direct_alice
    result = run(c, direct_vm, labels=["ROLE", "ROLE", "ROLE"])
    assert result["status"] == "RELEASED", result
    assert result["output"] == BODY


def test_unknown_label_holds_without_publishing(direct_vm, direct_deploy, direct_alice):
    c = direct_deploy("contracts/DisclosureSpanGuard.py")
    direct_vm.sender = direct_alice
    result = run(c, direct_vm, labels=["PERSONAL", "UNKNOWN", "PERSONAL"])
    assert result["status"] == "HELD"
    assert result["output"] == "" and result["output_hash"] == ""


def test_wrong_commitment_holds(direct_vm, direct_deploy, direct_alice):
    c = direct_deploy("contracts/DisclosureSpanGuard.py")
    direct_vm.sender = direct_alice
    result = run(c, direct_vm, expected="f" * 64)
    assert result["status"] == "HELD" and not result["hash_match"]


def test_fetch_failure_holds(direct_vm, direct_deploy, direct_alice):
    c = direct_deploy("contracts/DisclosureSpanGuard.py")
    direct_vm.sender = direct_alice
    result = run(c, direct_vm, status=503)
    assert result["status"] == "HELD" and result["http"] == 503


def test_replay_rejected(direct_vm, direct_deploy, direct_alice):
    c = direct_deploy("contracts/DisclosureSpanGuard.py")
    direct_vm.sender = direct_alice
    run(c, direct_vm)
    with direct_vm.expect_revert("reused job"):
        run(c, direct_vm)


def test_path_traversal_rejected(direct_vm, direct_deploy, direct_alice):
    c = direct_deploy("contracts/DisclosureSpanGuard.py")
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("invalid source"):
        c.transform("bad", "ehsandto", "disclosure-span-guard", COMMIT,
                    "../secret", "f" * 64, "PERSONAL")
