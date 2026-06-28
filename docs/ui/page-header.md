# Page header

Title block with optional single primary action.

## Reference

- [`domains-view.component.html`](../../src/app/components/domains-view/domains-view.component.html) — create list
- [`status-view.component.html`](../../src/app/components/status-view/status-view.component.html) — refresh-only dashboard

## Markup

```html
<div class="page-header">
  <div class="header-content">
    <h1 class="page-title">
      <mat-icon fontIcon="dns" class="title-icon"></mat-icon>
      Gestão de Domínios
    </h1>
    <p class="page-subtitle">Gerencie os domínios autorizados a acessar o sistema</p>
  </div>
  <div class="header-actions">
    <button class="btn" matButton [routerLink]="['/', 'domains', 'new']">
      <mat-icon fontIcon="add"></mat-icon>
      <span>Novo Domínio</span>
    </button>
  </div>
</div>
```

## Rules

| Rule | Detail |
|------|--------|
| Title icon | `mat-icon` with `class="title-icon"` inside `h1.page-title` |
| Subtitle | One sentence in `p.page-subtitle` |
| Primary action | At most **one** button in `header-actions` for list pages |
| Button class | **`class="btn"` only** — no `btn-outline` in `header-actions` |
| Create label | `Novo …` / `Nova …` (e.g. Novo Domínio, Nova Função, **Novo Canal**) |
| Router link | Array form: `[routerLink]="['/', 'domains', 'new']"` |
| Read-only lists | Omit `header-actions` entirely (e.g. Engage Vídeos) |
| Refresh-only | Single `class="btn"` with `refresh` icon (Estatísticas, Início) — no navigation buttons |

## Anti-patterns

```html
<!-- ❌ Secondary navigation in header (use app menu instead) -->
<button class="btn btn-outline" matButton routerLink="/engage/videos">Vídeos</button>

<!-- ❌ Multiple outline buttons competing with primary -->
<div class="header-actions">
  <button class="btn btn-outline">…</button>
  <button class="btn">Novo …</button>
</div>
```

Styles for `.header-actions .btn` are defined in `forms.less` and target **primary** buttons only; outline buttons in the header will not match layout/spacing.
