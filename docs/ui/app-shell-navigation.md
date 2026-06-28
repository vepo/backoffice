# App shell navigation

Global header menu and role-based visibility.

## Reference

[`app.html`](../../src/app/app.html)

## Rules

1. Desktop: `nav.main-nav` with `routerLink` + `routerLinkActive="active"`.
2. Mobile: duplicate entries in `mat-menu` (`#mobileNav`).
3. Restrict entries with `*role="'jwt.group'"` — exact group string from Passport.
4. Each menu item: `mat-icon` + `<span>` label in pt-BR.
5. **Cross-module navigation belongs here**, not in page `header-actions`.

### Engage (`engage.admin`)

| Label | Route |
|-------|-------|
| Canais | `/engage/channels` |
| Vídeos | `/engage/videos` |
| Estatísticas | `/engage/statistics` |

When adding a new Engage screen, register the route in `app.routes.ts` and add a menu entry here if it is a top-level module view.
