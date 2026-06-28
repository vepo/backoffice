# Table card

Responsive data table wrapper.

## Reference

[`domains-view.component.html`](../../src/app/components/domains-view/domains-view.component.html)

## Markup

```html
<div class="table-card">
  <div class="table-container">
    <div class="table-header">
      <div class="table-title">
        <mat-icon fontIcon="table_chart" class="table-icon"></mat-icon>
        <h3>Lista de Domínios</h3>
        <span class="table-subtitle">{{ items.length }} domínio(s) encontrado(s)</span>
      </div>
    </div>
    <div class="responsive-table">
      <table class="data-table">
        <thead>…</thead>
        <tbody>
          @for (item of items; track item.id) {
          <tr [class.row-even]="$even" [class.row-odd]="$odd">…</tr>
          }
        </tbody>
      </table>
      @if (items.length === 0) {
      <!-- empty-state — see empty-state.md -->
      }
    </div>
  </div>
</div>
```

## Rules

1. Table title: `Lista de …` with count in `table-subtitle`.
2. Use `@for` with `track` on stable id.
3. Alternate rows: `[class.row-even]="$even"` `[class.row-odd]="$odd"`.
4. Row actions in `td.column-actions` → see [table-row-actions.md](table-row-actions.md).
5. Empty table body: use [empty-state.md](empty-state.md) inside `.responsive-table`, not a separate page section.
