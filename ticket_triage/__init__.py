"""ticket_triage: turn raw support messages into structured, prioritised tickets.

A small, rule-based helper I built to practise the part of support I find most
useful: taking the messy way people report a problem ("the till is down again
and the queue is growing") and turning it into a structured ticket a technician
can act on. Everything here is plain rules I can read and explain, not a black box.
"""

from .classifier import Ticket, classify_message, classify_many

__all__ = ["Ticket", "classify_message", "classify_many"]
__version__ = "0.1.0"
