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
