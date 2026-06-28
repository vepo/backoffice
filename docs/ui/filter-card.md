# Filter card

Search and filter controls above data tables.

## Reference

[`domains-view.component.html`](../../src/app/components/domains-view/domains-view.component.html)

## Markup

```html
<div class="filter-card">
  <div class="filter-header">
    <mat-icon fontIcon="filter_alt" class="filter-icon"></mat-icon>
    <h3>Filtros</h3>
  </div>
  <div class="filter-grid">
    <div class="form-field">
      <input type="text" class="filter-input" placeholder="Filtrar por hostname..."
        [(ngModel)]="filter.hostname" (ngModelChange)="filterChanged()">
      <mat-icon fontIcon="search" class="input-icon"></mat-icon>
    </div>
    <!-- optional status toggles -->
    <div class="filter-actions">
      <button class="btn btn-outline btn-small" (click)="clearFilters()">
        <mat-icon fontIcon="clear_all"></mat-icon>
        Limpar Filtros
      </button>
    </div>
  </div>
</div>
```

## Rules

1. Title is always **Filtros** with `filter_alt` icon.
2. Text search uses `filter-input` + `search` input icon.
3. Status filters use `status-filter` / `status-toggle` / `status-badge` pattern from domains.
4. Clear action: **`btn btn-outline btn-small`** only — never primary `btn`.
5. Import `FormsModule` when using `ngModel`.
