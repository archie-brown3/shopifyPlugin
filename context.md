# Lost-Sale Survey Widget — Technical Context Document

## 1. Problem Statement

Shopify store owners lose a large percentage of potential customers at the point of exit (cart abandonment, product page exit, checkout hesitation) and **do not know why**.

Existing solutions:

- are overcomplicated survey platforms
- require customer identification or email
- degrade UX
- or bundle unnecessary features

**Core problem:**
Non-technical merchants need **clear, low-friction insight** into why customers leave, without configuring complex tools or harming conversion.

---

## 2. Solution Overview

A **lightweight JavaScript widget** injected into Shopify storefront pages that:

- detects exit intent (or other triggers)
- displays a **minimal, non-intrusive survey**
- collects **anonymous abandonment reasons**
- reports aggregated insights to the merchant

The app prioritizes:

- simplicity
- UX safety
- reliability across themes
- actionable insights over raw data

---

## 3. High-Level Architecture

```
Shopify Storefront
  └── widget.js (compiled)
        └── src/index.js
              ├── surveyUI.js
              ├── exitIntent.js
              ├── state.js
              └── api.js
```

```
Shopify Admin (Embedded App)
  └── Dashboard UI (React)
        └── Analytics / Settings
```

```
Backend (Node.js)
  ├── Auth (OAuth)
  ├── Billing
  ├── Survey response ingestion
  └── Aggregation / reporting
```

This document focuses on the **storefront widget**, which is the most critical and technically constrained component.

---

## 4. Storefront Widget Responsibilities

The widget is a **guest script** running inside an unknown Shopify theme.

It must:

- inject itself safely
- avoid global CSS/JS collisions
- degrade gracefully
- clean up after itself
- never block page interaction

### Explicit non-responsibilities

- no business logic
- no billing logic
- no merchant configuration UI
- no heavy analytics processing

---

## 5. Storefront File Structure

```
storefront/src/
  ├── index.js        # Entry point
  ├── surveyUI.js     # UI rendering & interaction
  ├── exitIntent.js   # Trigger detection (later phase)
  ├── state.js        # Session + throttling
  └── api.js          # Network calls (later phase)
```

### Build Output

```
public/widget.js
```

This single file is injected into Shopify storefronts.

---

## 6. index.js — Entry Point

### Responsibilities

- initialize the widget
- decide **when** to show the survey
- orchestrate UI + logic modules

### Constraints

- must be idempotent (safe to run once)
- must guard against duplicate renders
- must fail silently if conditions are not met

### Example responsibilities

```js
- check widget not already active
- wait for trigger
- call renderSurvey()
- handle callbacks
```

index.js **does not**:

- build UI directly
- contain DOM markup
- talk directly to the backend (later delegated)

---

## 7. surveyUI.js — UI Layer

### Responsibilities

- create all DOM elements dynamically
- inject scoped styles
- handle user interaction
- emit clean callbacks

### Public API

```js
renderSurvey({
  onSelect(reason),
  onClose()
})
```

### Design principles

- self-contained
- no global styles
- mobile-first
- accessible defaults
- fast render (<50ms)

### Implementation details

- overlay + modal pattern
- event delegation
- inline or injected CSS
- explicit cleanup on close

The UI layer **never stores data** and **never decides business behavior**.

---

## 8. Styling Strategy

- No external CSS files
- No reliance on theme styles
- Neutral system fonts
- Defensive CSS (explicit positioning, sizing)

Optional future enhancement:

- Shadow DOM for isolation (trade-offs acknowledged)

---

## 9. State & Throttling (Later Phase)

### Purpose

Prevent:

- survey spam
- repeated prompts per session
- negative UX impact

### Likely mechanisms

- `sessionStorage` for short-term state
- `localStorage` for longer cooldowns

Example:

```js
{
  lastShownAt: timestamp,
  shownThisSession: boolean
}
```

---

## 10. Trigger Logic (Later Phase)

Initial trigger:

- exit intent (mouse leave viewport)

Future triggers:

- time-on-page
- scroll depth
- cart abandonment
- checkout exit

Trigger logic is isolated from UI.

---

## 11. Data Handling

### Storefront

- collects **anonymous** reason string
- sends minimal payload

Example payload:

```json
{
  "shop_id": "...",
  "page_type": "product",
  "reason": "price",
  "timestamp": 123456789
}
```

### Backend

- aggregates responses
- does not store PII by default

---

## 12. Security & Performance Considerations

- no blocking scripts
- async loading
- minimal bundle size
- no access to customer identity
- no interference with checkout

Failure modes:

- widget fails silently
- store UX remains intact

This is non-negotiable.

---

## 13. Monetisation Context (Non-Technical)

Revenue model:

- recurring subscription
- pricing based on:

  - response volume
  - analytics depth
  - store size

The storefront widget is **identical for free and paid users**; monetisation occurs in:

- backend processing
- dashboard features

---

## 14. Definition of “Polished” (Technical)

A polished version means:

- no console errors
- consistent behavior across themes
- responsive UI
- graceful failure
- clean code boundaries
- testable modules

Not:

- feature-rich
- visually fancy
- heavily configurable

---

## 15. Non-Goals

Explicitly out of scope:

- A/B testing
- multi-question surveys
- customer identification
- email capture
- marketing automation

These dilute focus and increase complexity.

---

## 16. Why This Architecture Was Chosen

- aligns with Shopify’s constraints
- maximizes learning value
- minimizes accidental complexity
- supports gradual expansion

This is intentionally **boring, explicit, and safe**.

---

If you want next, I can:

- turn this into a **README.md**
- create a **task breakdown / roadmap**
- or annotate this with **code skeletons per file**

Say which.
