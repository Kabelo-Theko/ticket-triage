"""Command-line entry point.

Reads raw support messages (one per line) from a file or standard input and
prints structured tickets, either as a readable table or as JSON.

Examples:
    python -m ticket_triage.cli --file samples/messages.txt
    cat samples/messages.txt | python -m ticket_triage.cli --json
"""
from __future__ import annotations

import argparse
import json
import sys

from .classifier import classify_many


def _read_messages(path: str | None) -> list[str]:
    if path:
        with open(path, "r", encoding="utf-8") as handle:
            return handle.read().splitlines()
    # No file given: read from standard input so the tool can be piped to.
    return sys.stdin.read().splitlines()


def _print_table(tickets) -> None:
    if not tickets:
        print("No messages to classify.")
        return
    width = max(len(t.summary) for t in tickets)
    header = f"{'ID':<9}{'PRIORITY':<10}{'CATEGORY':<18}SUMMARY"
    print(header)
    print("-" * (len(header) + 4))
    for t in tickets:
        print(f"{t.id:<9}{t.priority:<10}{t.category:<18}{t.summary}")
    print()
    print("First steps")
    print("-" * 11)
    for t in tickets:
        print(f"{t.id}  {t.suggested_first_step}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Turn raw support messages into structured, prioritised tickets."
    )
    parser.add_argument("--file", help="Path to a text file, one message per line.")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of a table.")
    args = parser.parse_args(argv)

    messages = _read_messages(args.file)
    tickets = classify_many(messages)

    if args.json:
        print(json.dumps([t.to_dict() for t in tickets], indent=2, ensure_ascii=False))
    else:
        _print_table(tickets)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
