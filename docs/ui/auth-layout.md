# Auth layout

Login, password recovery, and reset screens.

## Reference

[`login.component.html`](../../src/app/components/login.component/login.component.html)

## Rules

1. Public routes — no `authGuard`; header uses `minimal` class via `isPublicAuthRoute()`.
2. Centered card layout; primary submit uses `class="btn"`.
3. Secondary link to login uses `btn btn-outline`.
4. Do not reuse `.page` / `.page-header` CRUD patterns on auth screens.
