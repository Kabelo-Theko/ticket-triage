"""Tests for the ticket classifier.

These check the behaviour I actually care about: that obvious categories are
detected, that trade-blocking messages are flagged High, and that the batch
sorter puts the urgent tickets first.
"""
from ticket_triage.classifier import classify_message, classify_many


def test_password_message_is_account_access():
    t = classify_message("I'm locked out and forgot my password")
    assert t.category == "Account & Access"


def test_till_down_is_point_of_sale_and_high_priority():
    t = classify_message("The till is down and the queue is growing")
    assert t.category == "Point of Sale"
    assert t.priority == "High"


def test_card_machine_is_high_priority():
    t = classify_message("The card machine is not connecting, customers can only pay cash")
    assert t.priority == "High"


def test_slow_wifi_is_network_and_medium():
    t = classify_message("The wifi is really slow and keeps dropping")
    assert t.category == "Network"
    assert t.priority == "Medium"


def test_phishing_is_security():
    t = classify_message("Got a suspicious link asking me to reset my password")
    assert t.category == "Security"


def test_unknown_message_falls_back_to_general():
    t = classify_message("Hi, can you help me with something when you get a chance")
    assert t.category == "General"
    assert t.priority == "Low"


def test_summary_is_trimmed_and_capitalised():
    t = classify_message("the printer is jammed. please help quickly.")
    assert t.summary.startswith("The printer is jammed")
    assert "\n" not in t.summary


def test_classify_many_sorts_high_priority_first():
    messages = [
        "the wifi is a bit slow",                       # Medium
        "can you help me whenever",                      # Low
        "the whole store is down and nobody can work",   # High
    ]
    tickets = classify_many(messages)
    assert [t.priority for t in tickets] == ["High", "Medium", "Low"]
    assert tickets[0].id == "TKT-0003"  # ids are assigned before sorting


def test_blank_lines_are_ignored():
    tickets = classify_many(["", "   ", "printer jam"])
    assert len(tickets) == 1
