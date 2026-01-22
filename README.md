# Lost-Sale Survey Widget

A lightweight, zero-dependency JavaScript widget for Shopify stores designed to capture customer feedback at the point of exit (cart abandonment, checkout hesitation, etc.) without degrading user experience or site performance.

## Problem & Solution

**The Problem:** Shopify merchants lose potential sales at exit points but lack insight into _why_ customers are leaving. Existing solutions are often heavy, intrusive, or overly complex.

**The Solution:** A "guest script" that:

- Detects exit intent (mouse leave, etc.).
- Displays a minimal, non-intrusive survey.
- Collects anonymous reasons.
- Reports aggregated insights to the merchant.

## Architecture Overview

The system is designed for **performance**, **security**, and **invisibility**.

### Components

1.  **Storefront Widget** (`/storefront`)

    - **Tech:** Vanilla JavaScript (ES Modules), compiled with Vite.
    - **Size:** < 5KB gzipped target.
    - **Isolation:** Shadow DOM + Defensive CSS to prevent theme conflicts.
    - **Transport:** `navigator.sendBeacon` for fire-and-forget data transmission.

2.  **Backend Services** (`/server`)

    - **Tech:** Node.js (Koa/Express).
    - **Data:** PostgreSQL (Relational) + Redis (Rate limiting).
    - **Auth:** OAuth 2.0 (Shopify).

3.  **Merchant Dashboard** (`/admin`)
    - **Tech:** React (embedded in Shopify Admin).

### Data Flow

1.  **Trigger:** User exit intent detected.
2.  **Render:** Survey UI appears (Shadow DOM).
3.  **Capture:** User selects reason.
4.  **Ingest:** Data sent asynchronously to the backend.
5.  **Aggregate:** Backend processes and aggregates anonymous data.

## Repository Structure

```
/
├── server/                 # Node.js API & Backend
│   ├── src/
│   │   ├── auth/           # OAuth implementation
│   │   └── api/            # Ingestion endpoints
├── storefront/             # Widget SDK
│   ├── src/
│   │   ├── index.js        # Entry point
│   │   ├── surveyUI.js     # UI rendering
│   │   ├── exitIntent.js   # Trigger detection
│   │   └── state.js        # Session control
│   └── vite.config.js      # Build config
└── .github/                # CI/CD workflows
```

## Constraints & Principles

- **Safety First:** The widget must never block the main thread or break the merchant's theme.
- **Privacy:** No PII collection by default.
- **Performance:** Async loading, heavily cached, minimal footprint.
- **No Global CSS:** All styles are injected/scoped to avoid collisions.

## Development

- **Build Tool:** Vite (Library Mode)
- **Testing:** Vitest (Unit), Playwright (E2E)
- **Linting:** ESLint + Prettier
