# Kitoko Salon (Kateops)

A salon app for **Kitoko by Kate**, a hairstylist who works solo. It covers what Optios does (agenda, clients, cash register, reports), with a cleaner, phone-first design. It works for one person and has room for a team later.

Live version (Claude artifact): https://claude.ai/artifact/VYP35Qpkv9P25rBn9y4tgQ

## Features
- **Agenda**: one day at a time, with a week strip at the top. Swipe between days, tap an empty slot to book, find the next free slot, repeat appointments, block time for breaks.
- **Klanten (clients)**: client file with warnings (e.g. allergy), tags, history, purchased products, prepaid credit and punch cards.
- **Kleurkaarten (colour cards)**: formula, developer, processing time and before/after photos.
- **Kassa (checkout)**: open bills, services, products, discount, gift cards, deposits, punch cards, split payment. Payment by Bancontact, cash, Payconiq, transfer or Kate's own **payment QR** (shown full screen). Offers to book the next visit.
- **Rapporten (reports)**: revenue, BTW (VAT), how full the agenda was, no-shows, top services and best clients, CSV export for the accountant.
- **Calendar**: .ics import (Google, Apple, Outlook), two-way sync with Google Calendar, .ics export.
- **Marketing**: WhatsApp reminders for tomorrow, messages to clients who haven't been back in a while, birthdays.
- **Menu**: one home button, opening a grid of large tiles for every page.
- **Meer (more)**: services, products and stock, gift cards, team, opening hours, backup/import (JSON, CSV).

## Technology
- One self-contained `index.html` (vanilla JS, no build step).
- Storage: the Claude artifact `db` capability (private per user), with localStorage as cache.
- Google Calendar through the artifact `mcp` capability (connector "Google Calendar").
- Fonts: Fraunces and Geist (Google Fonts).

Opened outside Claude (e.g. as a local file), the app keeps its data in this browser only and Google sync doesn't work.

## Structure
- `index.html` — the app
- `PROJECT_MEMORY.md` — decisions, status and gotchas (read this first)
- `docs/optios-research.md` — research on Optios and competitors
