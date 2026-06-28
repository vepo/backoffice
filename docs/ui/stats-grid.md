# Stats grid

Summary metric cards displayed below the page header.

## Reference

[`domains-view.component.html`](../../src/app/components/domains-view/domains-view.component.html)

## Markup

```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon active">
      <mat-icon fontIcon="check_circle"></mat-icon>
    </div>
    <div class="stat-content">
      <h3 class="stat-value">{{ count }}</h3>
      <p class="stat-label">Domínios Ativos</p>
    </div>
  </div>
</div>
```

## Icon modifier classes

Use semantic modifiers on `.stat-icon`:

| Class | Typical meaning |
|-------|-----------------|
| `active` | Positive / enabled count |
| `inactive` | Disabled / disconnected count |
| `total` | Grand total |
| `admin` | Admin-related metric |
| `manager` | Secondary aggregate |
| `user` | User-facing metric |

## Rules

1. Place immediately after `.page-header`.
2. Prefer 2–4 cards; grid responsive breakpoints are in `forms.less`.
3. Values in `h3.stat-value`; labels in `p.stat-label`.
4. Compute counts in the component — no hard-coded numbers.
