# ticket-triage

**Live demo: https://ticket-triage-nu.vercel.app/**

A small, rule-based tool that turns raw support messages into structured,
prioritised tickets.

I built this to practise the part of IT support I find most useful: taking the
messy way people actually report problems ("the till is down again and the
queue is growing") and turning it into something a technician can act on right
away. It reads a list of plain-English messages and, for each one, works out a
**category**, a **priority**, a short **summary**, and a sensible **first
troubleshooting step**.

It is deliberately rule-based rather than a machine-learning model. In support I
want to be able to explain *why* a ticket was tagged the way it was, and change
the rules when they get something wrong. Plain rules make that easy.

## What it does

For each message it produces a ticket like this:

```
ID        PRIORITY  CATEGORY          SUMMARY
------------------------------------------------------------------
TKT-0001  High      Point of Sale     The till at the front counter is down...
TKT-0010  High      Point of Sale     The card machine is not connecting...
TKT-0006  Medium    Security          Got an email with a suspicious link...
TKT-0002  Low       Account & Access  I forgot my password again...
```

- **Category** is matched from keywords (Account & Access, Point of Sale,
  Printer, Email, Network, Security, Hardware, Software, or General).
- **Priority** is High when something is blocking trade or many people, Medium
  for recurring or single-user nuisances, Low otherwise.
- **First step** is where I would reasonably start, so the ticket arrives with a
  head start instead of a blank page.

## How to run it

No external libraries are needed to run the engine (standard library only). Python 3.10+.

```bash
# from a file, one message per line
python -m ticket_triage.cli --file samples/messages.txt

# or pipe messages in
cat samples/messages.txt | python -m ticket_triage.cli

# get JSON instead of a table
python -m ticket_triage.cli --file samples/messages.txt --json
```

## The web UI (Triage Desk)

**Live: https://ticket-triage-nu.vercel.app/**

A multi-view web interface for pasting a noisy inbox and seeing it sorted, with
the single most urgent ticket called out as "Handle first". Beyond sorting, each
ticket arrives action-ready:

- **Routing** — every category maps to the team that owns it (POS, Network,
  Microsoft 365, Identity & Access, Security, and so on).
- **SLA countdown** — a triage-time picker drives a per-ticket breach time
  (High 4h, Medium 8h, Low 3 days).
- **First-response reply** — one click copies a ready user-facing
  acknowledgement email for that ticket.
- **Major-incident detector** — three or more tickets in one category in a batch
  raises a banner before you work them one by one.
- **CSV export** — download the whole triaged batch for Jira, ServiceNow or a
  spreadsheet.
- A **Reference** tab documents the priority rules, routing table and logic.

Navigation collapses to a hamburger menu on small screens.

**Run it with the real Python engine behind it:**

```bash
pip install -r requirements.txt
uvicorn web.server:app --reload
# open http://127.0.0.1:8000
```

The page posts to `POST /api/triage`, which runs the exact same
`classify_many` used by the command line, so the browser and the API always
agree.

**Zero-backend demo:** the front end in `docs/` also works as a plain static
page (open `docs/index.html`, or host it free on GitHub Pages). When no backend
is present, it falls back to a JavaScript copy of the same rules so the demo
still runs. The Python engine stays the source of truth; the JS mirror exists
only so the page works without a server.

**Deploy:** a `Dockerfile` and `render.yaml` are included for a free one-click
deploy on Render.

## Running the tests

```bash
pip install -r requirements-dev.txt
pytest
```

## How it is put together

```
ticket_triage/
    classifier.py   the rules: categories, priority, summary, first step
    cli.py          reads messages, prints a table or JSON
web/
    server.py       FastAPI: serves the UI and exposes the engine at /api/triage
docs/
    index.html      the Triage Desk web UI (also the static demo)
samples/
    messages.txt    ten example messages to try it on
tests/
    test_classifier.py
Dockerfile, render.yaml   free one-click deploy
```

## Honest limitations

- The rules are keyword-based, so an unusual wording can be miscategorised. The
  fix is to add the wording to the signal lists in `classifier.py`.
- Priority is a rough triage signal, not a guarantee. A human still reads the
  queue.
- It structures and prioritises tickets; it does not resolve them.

## Why I keep it simple

Most repetitive support work is not hard, it is just repetitive. Sorting and
prioritising the inbox is the kind of thing that is easy to get wrong when you
are busy, and easy to automate with rules you can read. That is the whole idea
here.

## Licence

MIT. See [LICENSE](LICENSE).
