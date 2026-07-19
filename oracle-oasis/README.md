# Oracle · Oasis

The unified **Oracle** application — a configurable hospitality platform, with
Oasis Aqualounge as the first implementation. This is a **new, self-contained
foundation**; it does not modify either existing live site:

- `oasisproposal.craftwebstudios.ca` — the proposal (reference implementation)
- `oasis.craftwebstudios.ca` — the demo (reference implementation)

Both remain live and untouched until this Oracle app reaches feature parity and
is approved.

## Approach

One self-contained, vanilla-modular application. No framework, no build step.
Configuration-driven, registry-backed. Production-scale infrastructure is
intentionally deferred ("implement before optimizing").

### Architecture (bottom → top)

| Layer | Responsibility |
|-------|----------------|
| **Living Environment** | One persistent water world behind everything (two composited canvas layers, reused verbatim from the proposal). |
| **Experience Shell** | One persistent chrome: brand mark + perspective selector + journey mode rail. |
| **Oracle Runtime** | One config store (single source of truth, seeded from `?build=`), one module registry, one stage, one context-preserving morph transition. |
| **Experience Modules** | Swappable experiences mounted into the stage (Proposal, Product Catalog, …). |

### Configuration model

`Master Registry → Capability IDs → Enhancement Catalog → Client Config → Runtime → Experiences`

The `?build=` URL parameter (shared with the proposal) seeds the client's
selected enhancements. Config is the single source of truth; modules re-read it.

## Status — Increments #1–#3

Delivered:

- **Living Environment** — persistent, app-wide water (caustics + ambient blobs).
- **Experience Shell** — persistent brand chrome; perspective + mode controls
  present as **inert placeholders** (they round-trip through Config to prove the
  plumbing, but do not yet change authorization or drive the journey).
- **Oracle Runtime** — config store seeded from `?build=`, module registry,
  single stage, context-preserving 250–400ms morph transition (reduced-motion
  aware). Modules are mounted once and cached (see CR-005).
- **Proposal (migrated)** — the full, approved proposal now runs as a real
  Experience Module: rendered **full-canvas** inside a **Shadow DOM** for total
  style isolation, opacity-only transition so its `position:fixed` gateway /
  elevator / water stay anchored. Design tokens inherit from Oracle's `:root`
  through the shadow boundary. (`images/` holds the proposal's photography.)
- **Build My Platform** — the real, config-driven flow:
  - **Selector** — every enhancement is a selectable card; toggling writes
    straight to the Config store (single source of truth) and the `?build=`
    URL. A live summary shows investment + timeline from the **same economics
    as the approved proposal** (Launch Package $43,750; per-enhancement
    midpoints and timeline adds).
  - **Generation** — "Build My Platform" plays the 5-stage sequence from the
    Technical Architecture (Building Configuration → Loading Enhancements →
    Configuring Perspectives → Preparing Concierge → Optimizing Experience),
    reduced-motion aware.
  - **Platform Complete** — a summary with **Experience My Platform** and
    **Revise My Platform** (→ back to the selector, selections preserved — the
    settled Revise-vs-Finalize distinction).
  - Reachable from the shell's **Build** mode; the mode rail tracks state.
- **Platform Experience** — the configured platform the client walks into.
  Entry passes through **age verification (19+)**, then opens an app-style
  surface whose **feature tabs are derived from `Config.selected`**: Home
  (always) + The Bar (guest) + Membership + Tonight (live) + Community + Offers
  (marketing) + Insights & Advisor (management-facing, from bisuite/biassist).
  Each panel is real and interactive (order a drink, request a song, claim an
  offer, RSVP). Reachable from the shell's **Experience** mode and from Platform
  Complete. Perspective lightly shapes it today (management-facing features lead
  under the Management perspective); full perspective morph is #6.

### Not yet built (later increments, in Directive priority order)

1. ~~Experience Shell~~ ✅
2. ~~Living Environment~~ ✅
3. ~~Proposal (migrate the real proposal here)~~ ✅
4. ~~Product Catalog / Build My Platform (real selection engine)~~ ✅
5. ~~Platform Experience~~ ✅
6. Perspectives (Guest / Member / Staff / Management — real)
7. Concierge (rule-driven, not AI)
8. Environmental interactions
9. Configuration integration (against the live Master Registry)
10. Visual refinement

Plus the journey state machine: Build My Platform → Experience My Platform →
Revise My Platform (loop, preserves selections) / Finalize My Platform →
Discovery Experience.

## Running it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server -d oracle-oasis 8000
# → http://localhost:8000/?build=guest,community,marketing
```

`?build=` accepts either a comma list of enhancement ids
(`?build=guest,community`) or the compact code string (`?build=gck`).
