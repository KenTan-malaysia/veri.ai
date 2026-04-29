"""Custom tools for the WhatsApp blaster agent.

Tools are registered with the Claude Agent SDK so the agent can call them
during its loop. Each tool is intentionally small and deterministic so the
agent can reason about failure cases (bad phone numbers, missing templates,
opt-outs) without surprises.

Nothing in this module ever hits a real API. Real providers (Twilio,
WhatsApp Cloud API) get wired up inside `send_whatsapp_message` when
`campaign.dry_run` is False — see the TODO comments below.
"""

from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any

try:
    # PyYAML is optional; campaigns can also be JSON.
    import yaml  # type: ignore
except ImportError:  # pragma: no cover
    yaml = None

from claude_agent_sdk import tool


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

E164_RE = re.compile(r"^\+[1-9]\d{7,14}$")


@dataclass
class Recipient:
    phone_e164: str
    name: str
    language: str
    opted_in: bool
    tags: list[str]
    custom_vars: dict[str, str] = field(default_factory=dict)

    @classmethod
    def from_row(cls, row: dict[str, str]) -> "Recipient":
        tags = [t.strip() for t in (row.get("tags") or "").split(",") if t.strip()]
        custom = {k: v for k, v in row.items() if k.startswith("var_")}
        opted_in = (row.get("opted_in") or "").strip().lower() in {"yes", "true", "1"}
        return cls(
            phone_e164=(row.get("phone_e164") or "").strip(),
            name=(row.get("name") or "").strip(),
            language=(row.get("language") or "en").strip() or "en",
            opted_in=opted_in,
            tags=tags,
            custom_vars=custom,
        )


@dataclass
class SendResult:
    phone_e164: str
    name: str
    status: str           # "sent" | "skipped" | "failed"
    reason: str = ""
    preview: str = ""     # rendered message body (first 300 chars)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _valid_e164(phone: str) -> bool:
    return bool(E164_RE.match(phone))


def _render(template: str, recipient: Recipient) -> str:
    ctx = {
        "name": recipient.name,
        "phone_e164": recipient.phone_e164,
        "language": recipient.language,
        **recipient.custom_vars,
    }
    out = template
    for k, v in ctx.items():
        out = out.replace("{{" + k + "}}", str(v))
    return out.strip()


def _load_campaign(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() in {".yaml", ".yml"}:
        if yaml is None:
            raise RuntimeError("PyYAML not installed — run `pip install pyyaml`.")
        return yaml.safe_load(text)
    return json.loads(text)


# ---------------------------------------------------------------------------
# Tools exposed to the agent
# ---------------------------------------------------------------------------

@tool(
    "load_recipients",
    "Load recipients from a CSV file. Returns total count, a sample of parsed rows, "
    "and validation issues (bad phone numbers, missing names).",
    {"csv_path": str},
)
async def load_recipients(args: dict[str, Any]) -> dict[str, Any]:
    path = Path(args["csv_path"]).expanduser()
    if not path.exists():
        return {"content": [{"type": "text", "text": f"ERROR: file not found: {path}"}]}

    rows: list[Recipient] = []
    issues: list[str] = []
    with path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):  # start=2 accounts for header
            r = Recipient.from_row(row)
            if not r.name:
                issues.append(f"row {i}: missing name")
            if not _valid_e164(r.phone_e164):
                issues.append(f"row {i}: bad phone '{r.phone_e164}' (need E.164 like +14155551234)")
            rows.append(r)

    # Cache on disk so later tools can read without re-parsing.
    cache = path.with_suffix(".parsed.json")
    cache.write_text(
        json.dumps([asdict(r) for r in rows], indent=2),
        encoding="utf-8",
    )

    summary = {
        "total_rows": len(rows),
        "opted_in": sum(1 for r in rows if r.opted_in),
        "opted_out": sum(1 for r in rows if not r.opted_in),
        "validation_issues": issues,
        "sample": [asdict(r) for r in rows[:3]],
        "cache_path": str(cache),
    }
    return {"content": [{"type": "text", "text": json.dumps(summary, indent=2)}]}


@tool(
    "preview_messages",
    "Render the campaign templates for up to N recipients without sending anything. "
    "Use this first to verify formatting, language routing, and variable substitution.",
    {"campaign_path": str, "csv_path": str, "n": int},
)
async def preview_messages(args: dict[str, Any]) -> dict[str, Any]:
    campaign = _load_campaign(Path(args["campaign_path"]))
    templates: dict[str, str] = campaign.get("templates", {})
    path = Path(args["csv_path"])
    n = int(args.get("n", 5))

    previews: list[dict[str, str]] = []
    with path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            r = Recipient.from_row(row)
            tmpl = templates.get(r.language) or templates.get("en") or ""
            previews.append({
                "to": r.phone_e164,
                "name": r.name,
                "language": r.language,
                "body": _render(tmpl, r),
            })
            if len(previews) >= n:
                break
    return {"content": [{"type": "text", "text": json.dumps(previews, indent=2)}]}


@tool(
    "send_whatsapp_message",
    "Send (or dry-run) a single WhatsApp message. Respects opt-out, validates E.164, "
    "and refuses to send if dry_run=True in the campaign. Returns the SendResult.",
    {"campaign_path": str, "phone_e164": str, "name": str, "body": str, "opted_in": bool},
)
async def send_whatsapp_message(args: dict[str, Any]) -> dict[str, Any]:
    campaign = _load_campaign(Path(args["campaign_path"]))
    dry_run = bool(campaign.get("dry_run", True))
    provider = campaign.get("provider", "stub")

    phone = args["phone_e164"]
    name = args["name"]
    body = args["body"]
    opted_in = bool(args["opted_in"])

    if not opted_in:
        result = SendResult(phone, name, "skipped", reason="not opted in")
    elif not _valid_e164(phone):
        result = SendResult(phone, name, "failed", reason=f"invalid phone '{phone}'")
    elif dry_run:
        result = SendResult(phone, name, "sent", reason="dry-run", preview=body[:300])
    else:
        # TODO: plug in a real provider. Example shapes:
        #   - Twilio:        POST /2010-04-01/Accounts/{sid}/Messages.json
        #                     form body: From=whatsapp:+... To=whatsapp:+... Body=...
        #   - WhatsApp Cloud: POST graph.facebook.com/v19.0/{phone_id}/messages
        #                     json body: { messaging_product, to, type: "text", text: { body } }
        # Until then, refuse to pretend we sent something.
        result = SendResult(
            phone, name, "failed",
            reason=f"provider '{provider}' not wired up; keep dry_run=true",
        )

    return {"content": [{"type": "text", "text": json.dumps(asdict(result), indent=2)}]}


@tool(
    "generate_report",
    "Write a blast report (JSON + human-readable markdown) summarizing a list of "
    "SendResults. The agent should pass the aggregated results it has collected.",
    {"out_dir": str, "campaign_name": str, "results_json": str},
)
async def generate_report(args: dict[str, Any]) -> dict[str, Any]:
    out_dir = Path(args["out_dir"]).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    campaign_name = args["campaign_name"]
    results: list[dict[str, Any]] = json.loads(args["results_json"])

    sent = [r for r in results if r["status"] == "sent"]
    skipped = [r for r in results if r["status"] == "skipped"]
    failed = [r for r in results if r["status"] == "failed"]

    json_path = out_dir / f"{campaign_name}_report.json"
    md_path = out_dir / f"{campaign_name}_report.md"
    json_path.write_text(json.dumps(results, indent=2), encoding="utf-8")

    lines = [
        f"# Blast report — {campaign_name}",
        "",
        f"- Total processed: **{len(results)}**",
        f"- Sent (or dry-run sent): **{len(sent)}**",
        f"- Skipped: **{len(skipped)}**",
        f"- Failed: **{len(failed)}**",
        "",
        "## Failures",
    ]
    for r in failed:
        lines.append(f"- {r['phone_e164']} ({r['name']}): {r['reason']}")
    lines.append("")
    lines.append("## Skipped")
    for r in skipped:
        lines.append(f"- {r['phone_e164']} ({r['name']}): {r['reason']}")
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    return {
        "content": [{
            "type": "text",
            "text": json.dumps({
                "report_json": str(json_path),
                "report_md": str(md_path),
                "sent": len(sent),
                "skipped": len(skipped),
                "failed": len(failed),
            }, indent=2),
        }]
    }


ALL_TOOLS = [load_recipients, preview_messages, send_whatsapp_message, generate_report]
