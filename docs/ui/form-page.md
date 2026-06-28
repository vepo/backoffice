# Form page

Create and edit screens with reactive forms.

## Reference

[`domains-edit.component.html`](../../src/app/components/domains-edit/domains-edit.component.html)

## Markup

```html
<div class="form-page">
  <a class="back-link" routerLink="/domains">
    <mat-icon fontIcon="arrow_back"></mat-icon>
    <span>Voltar para Domínios</span>
  </a>
  <div class="form-card">
    <div class="form-header">
      <mat-icon fontIcon="dns" class="title-icon"></mat-icon>
      @if (editMode) {
      <h2>Editar Domínio</h2>
      <p>Edite as informações do domínio</p>
      } @else {
      <h2>Novo Domínio</h2>
      <p>Registre um novo domínio no sistema</p>
      }
    </div>
    <form class="edit" [formGroup]="form" (ngSubmit)="save()">
      <!-- mat-form-field fields -->
      <div class="btn-group">…</div>
    </form>
  </div>
</div>
```

## Rules

1. Back link: `class="back-link"` to list route, label **Voltar para …**.
2. Titles: **Novo …** (create) / **Editar …** (edit).
3. Use `ReactiveFormsModule` + `mat-form-field appearance="fill"`.
4. Prefix field icons with `matPrefix`.
5. Optional `info-card` for non-field guidance (see domains token info).
6. Footer buttons: [buttons.md](buttons.md) `btn-group` pattern.
7. Show API/save errors with [error-banner.md](error-banner.md) above the form.
