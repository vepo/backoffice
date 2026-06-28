# Table row actions

Icon buttons in the last column of data tables.

## Reference

[`domains-view.component.html`](../../src/app/components/domains-view/domains-view.component.html) — `column-actions`

## Markup

```html
<td class="column-actions">
  <div class="action-buttons">
    <button class="btn-icon" matButton [routerLink]="['/', 'domains', domain.id]"
      matTooltip="Editar domínio">
      <mat-icon fontIcon="edit"></mat-icon>
    </button>
    <button class="btn-icon btn-danger" matButton (click)="confirmDelete(domain)"
      matTooltip="Desativar domínio">
      <mat-icon fontIcon="block"></mat-icon>
    </button>
  </div>
</td>
```

## Rules

1. Wrap buttons in `div.action-buttons`.
2. Use `btn-icon` + `matButton`; add `btn-danger` / `btn-ok` when semantic.
3. Always provide `matTooltip` in pt-BR.
4. Edit → `routerLink` to edit route.
5. Delete/disable → open confirm dialog, no direct API call in template.
6. Read-only extra actions (e.g. comments): `btn-icon` + `comment` icon + routerLink.
