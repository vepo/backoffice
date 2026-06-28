# Page layout

Root structure for authenticated CRUD and dashboard screens.

## Reference

- [`domains-view.component.html`](../../src/app/components/domains-view/domains-view.component.html)
- [`users-view.component.html`](../../src/app/components/users-view.component/users-view.component.html)

## Structure

```html
<div class="page">
  <div class="page-header">…</div>
  <div class="stats-grid">…</div>        <!-- optional -->
  <div class="filter-card">…</div>       <!-- optional -->
  <div class="table-card">…</div>        <!-- or other main content -->
</div>
```

## Rules

1. Wrap the entire template in `<div class="page">`.
2. Order blocks: **header → stats → filters → main content** when all are present.
3. Do not nest another `.page` inside `.page`.
4. Form create/edit screens use `.form-page` instead — see [form-page.md](form-page.md).
5. Auth screens use `.auth-page` — see [auth-layout.md](auth-layout.md).

## Engage notes

- **Canais**, **Vídeos**, **Estatísticas** are separate routes; navigate via the app menu, not duplicate links in each page header.
