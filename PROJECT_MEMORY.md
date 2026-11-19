# Project Memory — Kitoko Salon (for Kitoko by Kate)

## Overview
- Client / purpose: BLV's sister Kate, solo hairstylist ("Kitoko by Kate"). Optios-like salon app, solo-first, team-ready later.
- Live URL / repo: claude.ai artifact https://claude.ai/artifact/VYP35Qpkv9P25rBn9y4tgQ · GitHub BLVJeezy/kateops (main) · Vercel kateops.vercel.app (no Claude db/sync there → localStorage only).
- Stack: one self-contained HTML file, vanilla JS, no build. Persistence: artifact `db` capability under the viewer's private `data/users/<id>/salon` (settings in that doc; collections clients/services/products/colorcards/vouchers/punchcards one doc per item; appts/sales bucketed per month `YYYY-MM` docs `{items:{}}`). localStorage = cache/offline fallback. Demo mode = in-memory only.

## Design system
- Fonts: Fraunces (display, large titles), Geist (UI). Google Fonts.
- Colors: ivory bg #F4EFE8, surface #FFFDF9, ink #1F1A16, clay accent #B4532A, sage #5F7A61 (paid), amber #B9822A (arrived), rose #B23B3B (no-show / warnings). Dark mode supported.
- Tone: Dutch (Belgian), short and warm. Dials: variance 4 / motion 5 / density 6.
- Motion: Apple-style springs (critically damped default), draggable bottom sheets with velocity projection, reduced-motion respected.

## Decisions (newest first)
- 2026-11-19 — Navigation: tab bar removed → one home button (bottom centre) that opens a launcher with 12 large square tiles (Optios-style). Sub-pages open as meer/<view>.
- 2026-11-19 — Scrolling: switched from an inner scroll container to normal page scrolling (window) for smoother iPhone scrolling; sticky nav + week strip; background locked while a sheet is open; tap on the timeline ignored right after a scroll.
- 2026-11-19 — Betaal-QR: Kate uploads her own QR (max 3, PNG 640px, settings.qrs). Kassa button "Toon betaal-QR" + checkout method "QR-code" → full-screen white QR with amount + "Betaling ontvangen".
- 2026-11-19 — Scroll pass: renders wait while she's scrolling or touching (no stopped swipes), rAF-throttled scroll handler, scroll position kept per tab, client list loads 150 rows at a time as she scrolls, debounced search, tap nav title = scroll to top.
- 2026-11-19 — Mobile-first pass: 16px inputs (no iOS zoom), sticky week strip, swipe from the left edge to go back, sheets that move up with the keyboard, haptics, bigger tap targets.
- 2026-11-19 — Calendar: .ics import (any calendar, RRULE/TZ/EXDATE, client + service recognition, private items become blocks) + two-way Google Calendar sync via artifact `mcp` capability (server "Google Calendar": list_calendars, list_events, create_event, update_event, delete_event). Window: past 14–30 days → next 120 days. Echo guard: extId + "— Kitoko Salon" marker; ics/gcal duplicates linked by date+start+dur. .ics export via `downloads` (falls back to copy).
- 2026-11-19 — WhatsApp deep links (wa.me) for reminders instead of paid SMS — free, solo-friendly, Optios charges per SMS.
- 2026-11-19 — No GKS certification — research: certified register only required for horeca (Feb 2026); disclaimer shown in Kassa.
- 2026-11-19 — Online client booking page NOT built — needs a public backend; artifact db only allows signed-in invited viewers. Next step: Vercel/Supabase.
- 2026-11-19 — Higgsfield brand images generated (icon, hero, still life) + 5s Seedance teaser; remote images can't load in artifacts, so app uses inline SVG mark + user-uploaded cover photo.

## Conventions
- Prices incl. BTW (default 21%). Dates ISO `YYYY-MM-DD`, times `HH:MM`.
- Never hardcode client data; services list only via onboarding button.

## Status
- Done: v1 — agenda (day timeline, week strip, swipe, free-slot finder, repeat, blocks), klanten + fiche (kleurkaarten w/ photos, tegoed, beurtenkaarten, history), kassa (open rekeningen, lines, korting, cadeaubon, voorschot, beurtenkaart, split payment, rebook prompt, ticket copy), rapporten, producten/stock, diensten, cadeaubonnen, marketing (reminders/terugroepen/verjaardagen), team, instellingen, backup/import.
- Artifact is PUBLIC (BLV approved publishing with mcp/downloads on 2026-11-19).
- Next: online booking page (needs backend), French UI, Payconiq/Bancontact terminal link, Peppol invoices.

## Known issues / gotchas
- Public artifact: outside viewers hold `view` → cannot write their own db subtree; Kate must be invited as Contributor (or be in the org).
- Artifact sandbox blocks remote images, downloads, alert/confirm — use in-page dialogs and Copy buttons.
- db doc limit 256 KiB → photos compressed to ~720px JPEG.
