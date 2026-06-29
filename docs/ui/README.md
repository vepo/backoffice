# Backoffice UI patterns

Canonical reference for every reusable UI building block in Backoffice. **All new or changed screens must follow these patterns.**

Styles live in [`src/forms.less`](../../src/forms.less), [`src/styles.less`](../../src/styles.less), and [`src/dialogs.less`](../../src/dialogs.less).

## Before changing UI

1. Read the pattern doc(s) for the blocks you will touch (links below).
2. Open an existing screen that already follows the pattern (reference column).
3. After your change, update the relevant doc if you introduce a new variant or rule.

## Pattern index

| Pattern | Doc | Used for |
|---------|-----|----------|
| Page shell | [page-layout.md](page-layout.md) | Root wrapper for authenticated screens |
| Page header | [page-header.md](page-header.md) | Title, subtitle, primary header action |
| Buttons | [buttons.md](buttons.md) | Primary, outline, small, icon, danger |
| Stats grid | [stats-grid.md](stats-grid.md) | Summary cards above lists |
| Filter card | [filter-card.md](filter-card.md) | Search and status filters |
| Table card | [table-card.md](table-card.md) | Data tables and responsive wrapper |
| Empty state | [empty-state.md](empty-state.md) | Zero-result messaging and CTA |
| Form page | [form-page.md](form-page.md) | Create/edit reactive forms |
| Confirm dialog | [confirm-dialog.md](confirm-dialog.md) | Destructive or irreversible actions |
| Row actions | [table-row-actions.md](table-row-actions.md) | Edit, delete, enable icons in tables |
| App navigation | [app-shell-navigation.md](app-shell-navigation.md) | Header menu and role visibility |
| Quick cards | [quick-cards.md](quick-cards.md) | Home status shortcuts |
| Error banner | [error-banner.md](error-banner.md) | Inline page errors |
| Auth layout | [auth-layout.md](auth-layout.md) | Login, recovery, reset |
| Notification inbox | [notification-inbox.md](notification-inbox.md) | Inbox list, detail, shell badge, channel follow |

## Screen map (reference implementations)

| Screen | Route | Patterns |
|--------|-------|----------|
| Domains list | `/domains` | page-layout, page-header, stats-grid, filter-card, table-card, empty-state, row-actions |
| Domains edit | `/domains/new`, `/domains/:id` | form-page, buttons |
| Users list | `/users` | Same as domains |
| Roles list | `/roles` | Same as domains |
| Profiles list | `/profiles` | Same as domains |
| Engage channels | `/channels` | Same as domains + notification follow column + reports row action |
| Engage channel reports | `/channels/:id/reports` | page-layout, back-link, page-header (refresh), filter-card, table-card, empty-state |
| Engage videos | `/videos` | page-layout, page-header (no create action), stats-grid, filter-card, word-cloud card, table-card, empty-state |
| Engage statistics | `/statistics` | page-layout, page-header (refresh only), stats-grid, table-card, empty-state |
| Engage comments | `/channels/.../comments`, `/videos/.../comments` | page-layout, back-link, stats-grid, filter-card, table-card, empty-state |
| Notifications | `/notifications`, `/notifications/:id` | page-layout, page-header (refresh or read action), filter-card, table-card, empty-state, shell bell |
| Home | `/` | quick-cards, page-header (refresh) |
| Login / recovery | `/login`, … | auth-layout |

## Cross-cutting rules

- **pt-BR labels** — match [domain-specification.md](../domain-specification.md).
- **Module navigation** — use [`app.html`](../../src/app/app.html) menu links, not extra buttons in page headers.
- **One primary action** in list page headers — typically `Novo …` / `Nova …` (see [page-header.md](page-header.md)).
- **Never** put `btn-outline` navigation buttons in `header-actions` (outline is for cancel, filters, and dialogs).
