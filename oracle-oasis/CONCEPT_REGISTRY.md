# Oracle Concept Registry (in-project incubator)

The canonical Concept Registry lives in the Founding Documents (Drive) and is
frozen. This file is a **local incubator** for architectural ideas that surface
during implementation, so nothing is lost between increments. Items here are
candidates — they are not committed architecture until promoted.

Status legend: 🌱 raw idea · 🔍 exploring · ✅ adopted · 🧊 parked

---

## CR-001 · Multi-layer Living Water 🌱
**Raised by:** client, during Increment #1.
**Note:** "Come back and refine the water to be more lifelike — add a few more
layers as described in notes."
**Current state:** Two layers composited (deep caustics + drifting ambient
blobs), both reused verbatim from the proposal.
**Direction to explore later:**
- Additional depth layers (foreground foam/particles, mid parallax, deep floor).
- Subtle vertical parallax tied to scroll / stage transitions.
- Surface highlights and slow-moving light shafts for more life.
- Per-experience tinting so each module subtly shifts the water's mood while
  keeping one continuous environment.
- Keep it dependency-free and reduced-motion aware; performance budget first.
**Do not** start until the client's "notes" are on hand — they described a
specific layering they want. Ask for those notes when we return to this.
**Update (Increment #8):** the reactive hook now exists — a shared `ENV`
controller (`setMood` / `ripple` / eased `step`) drives energy + warm/cool tint
and interaction ripples. The future depth/foam/parallax layers plug into this
same controller, so mood and ripples will carry through them for free.

---

## CR-002 · Perspective as presentation morph 🔍
**Context:** "Perspective controls presentation, not authorization."
**Idea:** When perspective changes (Guest → Member → Staff → Management), the
*same* stage content morphs — chrome, density, and available affordances shift —
rather than navigating to a different page. The shell already round-trips
perspective through Config; the morph primitive already exists.
**Open question:** how much of a module's DOM is perspective-variant vs shared.

---

## CR-003 · Revise vs Finalize as permanent runtime states 🔍
**Context (settled decision):** Revise My Platform (keep refining, preserve
selections) and Finalize My Platform (transition design → implementation-prep)
are a permanent architectural distinction, not UI copy.
**Idea:** Model these as first-class Config `mode` states with guarded
transitions, so every module can render its Revise-mode vs Finalized-mode form.
The shell's inert mode rail is the placeholder for this.

---

## CR-004 · Discovery Experience as its own module 🔍
**Context (settled decision):** Discovery Experience is an Experience Module
(not a popup): Platform Summary + Discovery Scheduling + Confirmation.
**Scheduling rule:** live calendar with the first 7 days blocked (finalize on the
1st → earliest appointment the 8th).
**Placement:** registers like any other module; entered after Finalize.

---

## CR-005 · Full-canvas modules + Shadow-DOM isolation ✅
**Raised by:** implementation, Increment #3 (migrating the proposal).
**Adopted pattern:** two module presentations coexist under one runtime:
- **Staged** modules (Catalog, …) mount into the stage with the transform+opacity
  morph.
- **Full-canvas** modules (the Proposal) declare `fullCanvas:true`, render inside
  a **Shadow DOM** for total style isolation, and transition **opacity-only (no
  transform)** — a transformed ancestor would become the containing block for
  their `position:fixed` elements (gateway, elevator, water) and break them.
Modules are mounted once and cached (hidden via the `[hidden]` attribute), so a
full-canvas module keeps its internal state across swaps.
**Gotcha logged:** never set `display` on the proposal's `:host` — it overrides
`[hidden]` and the off-stage module won't collapse.

## CR-006 · Unify the Living Environment (strip the proposal's own water) 🔍
The migrated proposal still carries its **own** ambient + hero water (identical
code to Oracle's Living Environment), so while it's active two water systems run.
Faithful for now; later, strip the proposal's `#water`/`#herowater` and let the
single Oracle environment show through a transparent host — one environment,
better perf (no duplicate canvases). Depends partly on CR-001 (water refinement).

## CR-007 · Reachability / journey nav 🌱
The Catalog is currently reachable only via the runtime handle
(`window.Oracle.navigate('catalog')`) — the migrated proposal has no shell button
to it yet. This resolves naturally when **Build My Platform** wires the mode rail
(Build · Experience · Finalize · Revise) to real transitions. Until then the shell
chrome (brand, perspective) is the visible continuity proof over the proposal.

## CR-008 · Accessibility landmark dedup 🌱
The proposal brings its own `<main>` inside its shadow root, so the flattened a11y
tree can expose two `main` landmarks. Reconcile when perspectives/landmarks get a
dedicated pass (roadmap #6 / #10).

---

## CR-009 · Config bridge: proposal ⇆ Config (bidirectional) 🔍
**Raised by:** Increment #4.
The **Build My Platform** selector is now the config-driven selection surface —
toggles write to the single Config store and the `?build=` URL. The migrated
proposal still runs its **own** enhancement selector (its ENGINE), seeded from the
same `?build=` on load but not live-synced afterward. Later (roadmap #9,
"Configuration integration") make it bidirectional: proposal selections → Config,
Config → proposal, so both surfaces always agree in real time. For now the two
agree on load, and the selector is the authoritative surface.

## CR-010 · Economics as one shared source 🔍
Increment #4 mirrored the proposal's ENGINE economics (base $43,750, per-enhancement
`invest`/`timeAdd`) into Oracle's `CATALOG`. Two copies now exist. When the config
bridge lands (CR-009), collapse to ONE economics source (ideally derived from the
live Master Registry per the Founding Docs) so numbers can never drift between the
proposal and the selector.

## CR-014 · Concierge rule engine → data-driven 🔍 (Increment #7)
Delivered: a persistent, rule-driven concierge (ordered `RULES`, first match wins)
reads module · perspective · config and surfaces the most relevant next step; its
actions drive the app (navigate, toggle enhancements, switch perspective). It is
deliberately NOT AI. **Open thread:** the rules are hand-authored in-module. Later,
express them as data (context predicate → guidance → action) so new
modules/capabilities can register their own concierge rules, and optionally let an
AI *enhancement* propose guidance that still routes through the same deterministic
action layer.

## CR-011 · Build sequence is presentational (for now) 🌱
The 5-stage generation sequence is a timed animation, not real work — it sets the
tone of "the platform is being assembled." When real platform generation exists
(assembling actual modules/perspectives from Config), drive the stages from genuine
progress events instead of fixed timers.

## CR-012 · Platform feature registry ⇆ Master Registry 🔍
**Raised by:** Increment #5.
The Platform Experience maps `enhancement id → feature panel` in a small in-module
`FEATURES` table (guest→The Bar, live→Tonight, bisuite→Insights, …). This is the
value-prop made literal: selecting an enhancement makes its feature appear. Later,
derive these features (and their sub-capabilities) from the **live Master Registry**
rows rather than a hand-written table, so the platform's surface always matches the
registry (ties into CR-010 / roadmap #9). Panel *content* is representative demo
data for now.

## CR-013 · Perspective morph (member vs staff vs management) ✅ (Increment #6)
Delivered: the platform re-presents through four lenses (Member / Guest / Staff /
Management) with a morph transition. The same capability shows differently per
lens (ordering → "order a drink" for members, an "incoming orders" queue for
staff, "bar revenue" for management), and management depth scales with the
selected analytics. "Perspective controls presentation, not authorization."
**Open thread:** today each lens is a distinct render path. Later, drive the
per-lens presentation from capability metadata (per CR-012 / Master Registry) so
new capabilities automatically get member/staff/management presentations without
hand-written view code.
