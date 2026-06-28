# Empty state

Zero-result placeholder inside tables or sections.

## Reference

[`domains-view.component.html`](../../src/app/components/domains-view/domains-view.component.html) (bottom of table)

## Markup

```html
<div class="empty-state">
  <mat-icon fontIcon="dns" class="empty-icon"></mat-icon>
  <h3>Nenhum domínio encontrado</h3>
  <p>Tente ajustar os filtros ou criar um novo domínio.</p>
  <button class="btn" matButton [routerLink]="['/', 'domains', 'new']">
    <mat-icon fontIcon="add"></mat-icon>
    Criar Novo Domínio
  </button>
</div>
```

## Rules

| Context | Title pattern | CTA |
|---------|---------------|-----|
| Filtered list empty | `Nenhum … encontrado` | Optional create button |
| No data yet (Engage) | `Nenhum … cadastrado` / `Nenhum … sincronizado` | Primary create or link to config screen |
| Read-only (videos) | Explain sync requirement | Link to **Canais** if user must configure first |

1. Use domain-relevant `empty-icon` (`dns`, `subscriptions`, `video_library`, `comment`).
2. CTA uses **primary `btn`** + `matButton`, not outline.
3. Create CTA label: **`Criar Novo …`** (list) — header uses **`Novo …`**.
