# Shopify App Project: Lost-Sale Reason Collector

## 1. Overview

This project is a **Shopify public app** designed to help non-technical store owners understand **why customers don’t complete purchases**.

Instead of analytics, funnels, or session replays, the app collects **direct, structured feedback at the moment of abandonment** and turns it into simple, actionable insights.

Primary goal:
- Learn **real-world JavaScript** (frontend + backend)
- Learn **Shopify app architecture**
- Build something merchants actually **need**, not a toy app

---

## 2. What the App Does (Plain English)

When a customer is about to leave a product page or cart:

- A **single-question prompt** appears:
  > “What stopped you from buying today?”
- The customer selects one reason (1 click)
- The response is stored and aggregated
- The merchant sees:
  - Top reasons people don’t buy
  - Trends over time
  - Breakdown by product or page type

No technical knowledge required for merchants.
No intrusive surveys for customers.

---

## 3. Core Problems This App Solves

- Merchants guess why sales don’t happen
- Analytics explain *what*, not *why*
- Existing tools are:
  - Too technical
  - Too noisy
  - Too expensive
  - Too time-consuming

This app gives **direct answers** instead of guesses.

---

## 4. High-Level Architecture

The app has **three distinct layers**, all using JavaScript.

Customer Browser
└── Storefront JS Widget
└── App Backend (Node.js)
└── Database
└── Admin Dashboard (React)


Each layer has a clear responsibility.

---

## 5. Tech Stack

### Storefront (Customer-Facing)
- Vanilla JavaScript (ES6+)
- No frameworks
- Injected via Shopify **App Embed Block**
- Runs on:
  - Product pages
  - Cart page

Reason:
- Maximum compatibility
- Minimal performance impact
- Real JS fundamentals (DOM, events, state)

---

### Backend (Application Server)
- Node.js
- Express (or similar lightweight framework)
- Shopify Admin API (REST / GraphQL)
- Shopify OAuth
- Shopify Billing API

Responsibilities:
- App installation
- Store authentication
- Billing checks
- Feedback ingestion
- Data aggregation
- Configuration delivery

---

### Database
- PostgreSQL or SQLite (for MVP)
- Tables for:
  - Shops
  - Feedback responses
  - Aggregated metrics

Reason:
- Relational data fits reporting needs
- Simple queries
- Easy to extend later

---

### Admin Dashboard
- React
- Shopify Polaris (UI components)
- Shopify App Bridge

Responsibilities:
- Display insights
- Configure survey behavior
- View billing status

---

## 6. Storefront JavaScript Architecture

The storefront script is the **most important part**.

/storefront
├── loader.js
├── exitIntent.js
├── surveyUI.js
├── throttle.js
├── apiClient.js
└── state.js


### loader.js
- Entry point
- Detects page type
- Fetches config from backend
- Decides whether to activate survey

---

### exitIntent.js
Detects abandonment intent:
- Mouse leaving viewport (desktop)
- Back navigation
- Rapid upward scroll (mobile)
- Tab visibility change

Emits a single internal event:
EXIT_INTENT


---

### surveyUI.js
- Renders the one-question prompt
- Handles clicks
- Destroys itself cleanly after response
- Uses inline styles or Shadow DOM to avoid theme conflicts

---

### throttle.js
Prevents annoying users:
- Show once per session
- Cooldown (e.g. once per 7 days)
- Never show again after response

Uses:
- sessionStorage
- localStorage

---

### apiClient.js
- Sends feedback to backend
- Uses `navigator.sendBeacon` when possible
- Falls back to `fetch`
- Never blocks navigation

---

### state.js
Stores lightweight client state:
- Has survey been shown?
- Has user responded?
- Last shown timestamp

---

## 7. Backend Architecture

/server
├── auth/
├── billing/
├── routes/
│ ├── config.js
│ ├── feedback.js
│ └── reports.js
├── webhooks/
├── db/
└── app.js


---

### auth/
Handles Shopify OAuth:
- App install
- Token exchange
- Store identification
- Permission scopes

Required for:
- API access
- Script injection
- Billing

---

### billing/
Handles:
- Subscription creation
- Trial periods
- Plan checks
- Feature gating
- Uninstall cleanup

Billing is mandatory for public apps.

---

### routes/config.js
Returns runtime configuration to storefront JS:
- Survey enabled/disabled
- List of reasons
- Throttling rules

This allows changes without redeploying JS.

---

### routes/feedback.js
Receives customer responses:
- Validates input
- Stores raw feedback
- Updates aggregates

---

### routes/reports.js
Serves aggregated data to admin dashboard:
- Top reasons
- Trends
- Per-product breakdowns

---

## 8. Data Model (Simplified)

### shops
- id
- shop_domain
- access_token
- plan
- installed_at

### feedback
- id
- shop_id
- page_type
- product_id (nullable)
- reason
- created_at

### aggregates
- shop_id
- period (day/week)
- reason
- count

---

## 9. Shopify-Specific Mechanics

### App Installation
- Merchant installs via Shopify App Store
- OAuth handshake
- Access token stored server-side
- Webhooks registered

---

### Script Injection
- Uses **App Embed Block**
- Merchant can toggle survey on/off
- Safe, Shopify-approved method

---

### Security Model
- Storefront JS is public
- Backend never trusts client data
- Rate limits feedback submissions
- All sensitive logic server-side

---

## 10. Monetization Model

Simple, predictable pricing:

- Free: up to 100 responses/month
- $9/month: 1,000 responses
- $19/month: unlimited + product insights

Billing enforced via Shopify Billing API.

---

## 11. Why This Project Is Worth Building

From a learning perspective:
- Real JavaScript (not tutorials)
- Real SaaS constraints
- OAuth, billing, embedded apps
- Frontend + backend integration

From a business perspective:
- Solves a real merchant problem
- Understandable by non-technical users
- Low feature bloat
- Clear value proposition

---

## 12. Explicit Non-Goals (Important)

This app will NOT:
- Use AI
- Replace analytics tools
- Add heatmaps or session replay
- Overwhelm merchants with data

The goal is **clarity**, not complexity.

---

## 13. Future Extensions (Optional)

- Per-market feedback
- Auto-suggested fixes
- Post-purchase “why did you buy?” prompts
- Email summaries
- Integrations with pricing/shipping tools

These are deliberately **out of scope** for MVP.

---

## 14. MVP Build Order

1. Storefront JS widget
2. Feedback ingestion endpoint
3. Minimal admin dashboard
4. Auth + billing
5. Polish UX and copy

---

## Final Note

If this app were launched and made $200/month, it would already be a success:
- Technically credible
- Commercially real
- Strong portfolio signal

This is the correct scale for a first serious Shopify app.
