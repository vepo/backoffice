# Error banner

Inline error message on a page (not dialog).

## Reference

[`engage-statistics-view.component.html`](../../src/app/components/engage-statistics-view/engage-statistics-view.component.html)

## Markup

```html
@if (error) {
<div class="error">
  <mat-icon fontIcon="error_outline"></mat-icon>
  <span>{{ error }}</span>
</div>
}
```

## Rules

1. Place below page header (or below form header on form pages).
2. Set message in component on HTTP failure; clear before retry.
3. User-facing text in pt-BR; do not expose raw stack traces.
