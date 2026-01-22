# System Architecture: Lost-Sale Survey Widget

> [!NOTE]
> This document outlines the technical architecture for the Lost-Sale Survey Widget, designed to meet production SaaS standards for performance, scalability, and maintainability.

## 1. High-Level Overview

The system consists of three primary components:

1.  **Storefront Widget**: A lightweight, dependency-free JavaScript SDK injected into client Shopify stores.
2.  **API Gateway / Backend**: A standardized Node.js service handling ingestion, authentication, and aggregation.
3.  **Merchant Dashboard**: An embedded Shopify Admin App (React) for configuration and analytics.

## 2. Technology Stack

### Storefront Widget (`/storefront`)

- **Language**: Vanilla JavaScript (ES Modules)
- **Build Tool**: Vite (Library Mode)
  - _Why_: Tree-shaking, minification, and ability to output a unified `widget.js` with isolated scope (IIFE/UMD).
- **Styling**: Shadow DOM with injected CSS (Raw CSS strings in JS).
  - _Why_: Complete isolation from host theme styles to prevent bleeding.
- **State Management**: Nano-state (Internal minimal store).
- **Legacy Support**: Graceful degradation (ES5 fallback if absolutely necessary, though ES6+ is standard for modern Shopify).

### Backend Services (`/server`)

- **Runtime**: Node.js (v18+ LTS)
- **Framework**: Koa or Express (Minimalist, fast)
- **Database**: PostgreSQL (Relational data for users/shops) + Redis (Rate limiting/Session caching).
- **Auth**: OAuth 2.0 (Shopify Direct).

### Admin Dashboard (`/admin` - _Future_)

- **Framework**: React (Shopify Polaris)
- **Build**: Vite
- **Hosting**: Served via Backend application.

## 3. Directory Structure

```
/
├── .github/                # CI/CD workflows
├── server/                 # Node.js API & Backend
│   ├── src/
│   │   ├── auth/           # OAuth implementation
│   │   ├── api/            # REST/GraphQL endpoints
│   │   ├── db/             # Database models/queries
│   │   ├── services/       # Business logic (Ingestion, Billing)
│   │   └── middleware/     # Security, Logging, Error handling
│   ├── app.js
│   └── package.json
├── storefront/             # Widget SDK
│   ├── src/
│   │   ├── core/           # Lifecycle, Event Bus
│   │   ├── ui/             # Web Components or Raw DOM manipulation
│   │   ├── triggers/       # Exit Intent, Scroll, Timer
│   │   └── api.js          # Beacon API / Fetch wrapper
│   ├── vite.config.js      # Build config
│   └── package.json
└── another.md              # This architecture document
```

## 4. Data Flow

### Ingestion Pipeline

1.  **Trigger**: User moves mouse out of viewport.
2.  **Widget**: `exitIntent.js` fires event.
3.  **UI**: Widget renders in Shadow DOM.
4.  **Action**: User clicks feedback reason.
5.  **Transport**: `navigator.sendBeacon` (fire-and-forget) to `/api/ingest`.
    - _Payload_: `{ shopId, shopUrl, reason, timestamp, sessionToken }`
6.  **Backend**: Validates origin, rate-limits request, queues for async write.

## 5. Security & Performance Strategy

- **Zero-Dependency Widget**: The storefront bundle must be < 5KB gzipped.
- **CSP Compliance**: Widget must support strict Content Security Policies (no inline scripts if possible, or robust nonce handling).
- **Origin Validation**: Backend must verify `Origin` headers against registered shops.
- **Rate Limiting**: Per-IP and per-session throttling to prevent abuse.
- **Non-Blocking**: Async loading of the widget script.

## 6. Deployment & CI/CD

- **Linting/Formatting**: ESLint + Prettier.
- **Testing**:
  - Vitest for Unit testing (storefront logic).
  - Playwright for E2E testing (browser simulation).
- **Versioning**: Semantic versioning for the widget `npm` package (if published) or internal version tracking.
