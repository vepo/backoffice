# Quick cards

Shortcut tiles on the home (status) page.

## Reference

[`status-view.component.html`](../../src/app/components/status-view/status-view.component.html)

## Markup

```html
<a class="quick-card" *role="'domains.admin'" routerLink="/domains">
  <mat-icon fontIcon="public"></mat-icon>
  <div>
    <strong>Domínios</strong>
    <span>Hostnames e tokens de rastreamento</span>
  </div>
  <mat-icon fontIcon="arrow_forward" class="arrow"></mat-icon>
</a>
```

## Rules

1. Use `<a class="quick-card">` with `routerLink`, not buttons.
2. `*role` when the destination requires a specific JWT group.
3. Title in `<strong>`, one-line description in `<span>`.
4. Trailing `arrow_forward` icon with class `arrow`.
