"""Core logic: classify a raw support message into a structured ticket.

The whole approach is deliberately simple and rule-based. Each message is:
  1. matched against category signals (keywords and short phrases),
  2. given a priority from a small set of urgency signals,
  3. returned as a structured Ticket with a sensible first troubleshooting step.

I kept it rule-based on purpose. In a support setting I want to be able to
explain why a ticket was tagged the way it was, and tweak the rules when they
get something wrong. That is harder to do with a model I cannot inspect.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, asdict
from typing import Iterable


# Category signals, checked in order. Narrower categories (Point of Sale,
# Printer, Email) come before broad ones (Software) so a "till" message is not
# swallowed by a generic "Software" match. The first category that matches wins.
CATEGORY_SIGNALS: list[tuple[str, list[str]]] = [
    # Security is checked first on purpose: a phishing message often contains
    # "password" or "reset", and I would rather catch the security risk than
    # file it as a routine account reset.
    ("Security", [
        "virus", "malware", "phishing", "suspicious link", "suspicious email",
        "hacked", "ransomware",
    ]),
    ("Account & Access", [
        "password", "reset", "locked out", "can't log in", "cannot log in",
        "log in", "login", "sign in", "mfa", "2fa", "access denied", "permission",
        "new starter", "onboard",
    ]),
    ("Point of Sale", [
        "pos", "point of sale", "till", "card machine", "payment terminal",
        "checkout", "speedpoint", "pay cash",
    ]),
    ("Printer", [
        "printer", "printing", "toner", "paper jam", "scanner", "scan to email",
    ]),
    ("Email", [
        "outlook", "mailbox", "exchange", "spam", "can't send", "cannot send",
        "email", "e-mail",
    ]),
    ("Network", [
        "wifi", "wi-fi", "internet", "network", "vpn", "dns", "dhcp",
        "no connection", "offline", "no internet", "wireless",
    ]),
    # Software before Hardware so "Teams crashes when I share my screen" is read
    # as a software problem, not a broken screen.
    ("Software", [
        "install", "update", "licence", "license", "application", "software",
        "excel", "word", "teams", "crash", "crashing", "error message",
    ]),
    ("Hardware", [
        "laptop", "cracked screen", "black screen", "keyboard", "mouse",
        "monitor", "battery", "charger", "won't turn on", "wont turn on",
        "blue screen", "overheating", "no power",
    ]),
]

# Urgency signals. A High signal means the problem is blocking trade or many
# people; Medium means it is a nuisance or recurring. Everything else is Low.
HIGH_SIGNALS = [
    "down", "can't work", "cannot work", "whole store", "all tills", "store is",
    "nobody can", "everyone", "urgent", "asap", "trading", "lost data",
    "ransomware", "hacked", "card machine", "pos down", "queue is growing",
    "pay cash", "can only pay",
]
MEDIUM_SIGNALS = [
    "slow", "keeps", "again", "intermittent", "one user", "can't print",
    "cannot print", "can't send", "cannot send", "every now and then",
]

# A sensible first step per category. This is not the full fix, just where a
# technician would reasonably start, so the ticket arrives with a head start.
FIRST_STEPS = {
    "Account & Access": "Confirm the exact username and error, then check the account in Active Directory for lockout or expiry before resetting.",
    "Point of Sale": "Check whether the till has network and power, confirm if other tills are affected, and treat it as trade-blocking until proven otherwise.",
    "Printer": "Confirm the printer is on and online, check the queue for a stuck job, and verify the user is printing to the right device.",
    "Email": "Check whether the issue is send, receive or both, confirm Outlook is connected to Exchange, and test webmail to isolate client vs server.",
    "Network": "Establish how many users are affected, check the local switch or access point, and test DNS and gateway before escalating the line.",
    "Security": "Isolate the affected device from the network, do not delete anything, and escalate to senior IT immediately while preserving evidence.",
    "Hardware": "Confirm power and cabling, note any error or beep codes, and check whether the fault is reproducible before arranging a swap or repair.",
    "Software": "Confirm the exact application and error text, check whether it affects one user or many, and verify version and pending updates.",
    "General": "Acknowledge the user, capture the exact symptom and how many people it affects, then reproduce before changing anything.",
}


@dataclass
class Ticket:
    """A structured ticket produced from one raw support message."""
    id: str
    category: str
    priority: str            # "High", "Medium" or "Low"
    summary: str
    suggested_first_step: str
    raw_message: str

    def to_dict(self) -> dict:
        return asdict(self)


def _normalise(text: str) -> str:
    """Lowercase and collapse whitespace so matching is predictable."""
    return re.sub(r"\s+", " ", text.strip().lower())


def _match_category(text: str) -> str:
    for category, signals in CATEGORY_SIGNALS:
        if any(signal in text for signal in signals):
            return category
    return "General"


def _match_priority(text: str) -> str:
    if any(signal in text for signal in HIGH_SIGNALS):
        return "High"
    if any(signal in text for signal in MEDIUM_SIGNALS):
        return "Medium"
    return "Low"


def _summarise(raw: str, limit: int = 80) -> str:
    """A short, clean one-line summary from the first sentence of the message."""
    first = re.split(r"[.!?\n]", raw.strip(), maxsplit=1)[0].strip()
    if len(first) > limit:
        first = first[: limit - 1].rstrip() + "…"
    return first[:1].upper() + first[1:] if first else "No detail provided"


def classify_message(raw: str, ticket_id: str = "TKT-0001") -> Ticket:
    """Turn one raw message into a structured Ticket."""
    text = _normalise(raw)
    category = _match_category(text)
    priority = _match_priority(text)
    return Ticket(
        id=ticket_id,
        category=category,
        priority=priority,
        summary=_summarise(raw),
        suggested_first_step=FIRST_STEPS.get(category, FIRST_STEPS["General"]),
        raw_message=raw.strip(),
    )


def classify_many(messages: Iterable[str], start: int = 1) -> list[Ticket]:
    """Classify several messages, returning a list sorted High to Low priority."""
    order = {"High": 0, "Medium": 1, "Low": 2}
    tickets = [
        classify_message(msg, ticket_id=f"TKT-{i:04d}")
        for i, msg in enumerate(messages, start=start)
        if msg.strip()
    ]
    tickets.sort(key=lambda t: order[t.priority])
    return tickets
