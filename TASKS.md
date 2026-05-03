# Frontend Architecture Refactor Status

## Final Frontend Folder Tree

```text
apps/frontend/src/app/
├── app.config.ts
├── app.html
├── app.routes.ts
├── app.scss
├── app.ts
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   └── health.models.ts
│   └── services/
│       ├── backend-health.service.ts
│       └── theme.service.ts
├── features/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   ├── login.page.html
│   │   │   │   ├── login.page.scss
│   │   │   │   └── login.page.ts
│   │   │   └── register/
│   │   │       ├── register.page.html
│   │   │       ├── register.page.scss
│   │   │       └── register.page.ts
│   │   └── services/
│   │       └── auth.service.ts
│   ├── billing/
│   │   ├── billing.page.html
│   │   ├── billing.page.scss
│   │   ├── billing.page.ts
│   │   └── billing.routes.ts
│   ├── customers/
│   │   ├── customers.page.html
│   │   ├── customers.page.scss
│   │   ├── customers.page.ts
│   │   ├── customers.routes.ts
│   │   └── services/
│   │       └── customers.service.ts
│   ├── dashboard/
│   │   ├── dashboard.page.html
│   │   ├── dashboard.page.scss
│   │   ├── dashboard.page.ts
│   │   ├── dashboard.routes.ts
│   │   └── services/
│   │       └── dashboard.service.ts
│   ├── expenses/
│   │   ├── expenses.page.html
│   │   ├── expenses.page.scss
│   │   ├── expenses.page.ts
│   │   └── expenses.routes.ts
│   ├── invoices/
│   │   ├── invoices.routes.ts
│   │   ├── models/
│   │   │   └── invoice.models.ts
│   │   ├── pages/
│   │   │   ├── invoice-detail/
│   │   │   │   ├── invoice-detail.page.html
│   │   │   │   ├── invoice-detail.page.scss
│   │   │   │   └── invoice-detail.page.ts
│   │   │   └── invoice-list/
│   │   │       ├── invoice-list.page.html
│   │   │       ├── invoice-list.page.scss
│   │   │       └── invoice-list.page.ts
│   │   └── services/
│   │       └── invoice.service.ts
│   ├── overview/
│   │   ├── overview.page.html
│   │   ├── overview.page.scss
│   │   ├── overview.page.ts
│   │   └── overview.routes.ts
│   ├── reports/
│   │   ├── pages/
│   │   │   ├── finance/
│   │   │   │   ├── reports-finance.page.html
│   │   │   │   ├── reports-finance.page.scss
│   │   │   │   └── reports-finance.page.ts
│   │   │   └── sales/
│   │   │       ├── reports-sales.page.html
│   │   │       ├── reports-sales.page.scss
│   │   │       └── reports-sales.page.ts
│   │   ├── reports.page.html
│   │   ├── reports.page.scss
│   │   ├── reports.page.ts
│   │   └── reports.routes.ts
│   └── settings/
│       ├── settings.page.html
│       ├── settings.page.scss
│       ├── settings.page.ts
│       └── settings.routes.ts
└── shared/
    ├── components/
    │   ├── dashboard-card/
    │   │   ├── dashboard-card.component.html
    │   │   ├── dashboard-card.component.scss
    │   │   ├── dashboard-card.component.ts
    │   │   ├── dashboard-card.demo.html
    │   │   ├── dashboard-card.demo.scss
    │   │   ├── dashboard-card.demo.ts
    │   │   ├── dashboard-card.types.ts
    │   │   └── index.ts
    │   └── sidebar-navigation/
    │       ├── index.ts
    │       ├── sidebar-navigation.component.html
    │       ├── sidebar-navigation.component.scss
    │       └── sidebar-navigation.component.ts
    ├── models/
    │   ├── index.ts
    │   └── navigation.models.ts
    └── services/
        ├── navigation/
        │   └── sidebar-navigation-api.service.ts
        ├── navigation.service.ts
        ├── tenant-context.service.ts
        └── theme.service.ts
```

## Architecture Checklist

- [x] Pass: Feature-based folder structure (not type-based)
- [x] Pass: Each feature has its own routes/components/services
- [x] Pass: No API calls directly in components
- [x] Pass: Business logic extracted to services (navigation + invoices)
- [x] Pass: Shared components centralized in shared/
- [x] Pass: API base URL uses environments (no hardcoded localhost in services)
- [x] Pass: Inline styles extracted to SCSS files
- [x] Pass: Interfaces/models moved to dedicated models folders
- [x] Pass: App routes lazy-load feature route files
- [x] Pass: Build verification complete (`ng build`)

## Backend Architecture Status

### Current Backend Structure

```text
apps/backend/
├── app/
│   ├── core/
│   ├── db/
│   ├── routes/
│   └── services/
├── config.py
├── main.py
└── schemas.py
```

### Backend Architecture Refactor Tasks

- [ ] Move `config.py` to `app/core/config.py` and update references.
- [ ] Move `schemas.py` to an appropriate folder (e.g., `app/schemas/` or `app/models/`).
- [ ] Create API routers in `app/routes/` and move endpoints from `main.py` into them.
- [ ] Initialize database connection and ORM setup in `app/db/`.
- [ ] Move business logic to `app/services/` instead of keeping it in route handlers.
- [ ] Configure dependency injection for database sessions.

## Miscellaneous Tasks

- [ ] Resolve duplicate `theme.service.ts` in frontend (found in both `core/services/` and `shared/services/`).
