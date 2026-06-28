# Buttons

Shared button classes and when to use each variant.

## Reference

- [`forms.less`](../../src/forms.less) — `.btn`, `.btn-outline`, `.btn-group`
- [`dialogs.less`](../../src/dialogs.less) — dialog actions

## Variants

| Class | Use case | Example location |
|-------|----------|------------------|
| `btn` | Primary action | Page header create, form submit, empty-state CTA, dialog confirm (non-destructive) |
| `btn btn-outline` | Secondary / cancel | Form cancel, dialog cancel, filter “Limpar Filtros” |
| `btn btn-outline btn-small` | Tertiary compact | Filter card actions only |
| `btn btn-danger` | Destructive confirm | Dialog delete, row delete confirm |
| `btn btn-ok` | Positive row action | Re-enable domain/user |
| `btn-icon` | Table row icon buttons | Edit, delete, comment link |
| `btn-icon btn-danger` | Destructive row action | Delete channel |

## Markup

Always use **`matButton`** on Material buttons in app pages:

```html
<button class="btn" matButton type="button" (click)="save()">
  <mat-icon fontIcon="save"></mat-icon>
  <span>Salvar Alterações</span>
</button>
```

Icon before label; wrap label in `<span>`.

## Rules by context

### List page header (`header-actions`)

- **Primary `btn` only** — see [page-header.md](page-header.md).
- Never `btn-outline` for cross-page navigation.

### Form footer (`btn-group`)

```html
<div class="btn-group">
  <button class="btn btn-outline" type="button" (click)="cancel()">…</button>
  <button class="btn" type="submit" [disabled]="form.invalid">…</button>
</div>
```

- Cancel: `btn-outline`
- Submit: `btn`
- Create submit label: `Criar …` — Edit submit label: `Salvar Alterações`

### Filter card

```html
<button class="btn btn-outline btn-small" (click)="clearFilters()">
  <mat-icon fontIcon="clear_all"></mat-icon>
  Limpar Filtros
</button>
```

### Empty state

- Primary `btn` + `matButton` + create routerLink
- Label: `Criar Novo …` (matches domains empty state)

### Confirm dialog

- Cancel: `btn btn-outline` + `mat-dialog-close`
- Confirm delete: `btn btn-danger` + `[mat-dialog-close]="true"`

## Loading state

For async header actions (refresh), disable the button and swap icon for `mat-spinner`:

```html
<button class="btn" matButton (click)="refresh()" [disabled]="loading">
  @if (loading) {
  <mat-spinner diameter="18"></mat-spinner>
  } @else {
  <mat-icon fontIcon="refresh"></mat-icon>
  }
  <span>Atualizar</span>
</button>
```
