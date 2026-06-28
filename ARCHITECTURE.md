# Architecture & Conventions

Canonical reference for developers and AI agents working on Backoffice. Domain terms: [docs/domain-specification.md](docs/domain-specification.md).

## 1. Core principles

- **Angular SPA** — Standalone components, Angular Material, reactive forms.
- **Self-hosted fonts** — Inter, Roboto, and Material Icons via npm (`@fontsource/*`, `material-icons`); bundled in `src/fonts.scss` — no Google Fonts CDN.
- **Multi-service admin shell** — Proxies to Passport (identity), Visita (domains), Engage (future).
- **JWT auth** — Login via Passport; token in `localStorage`; `Authorization` header on API calls.
- **Role-based UI** — `*role` directive hides menu entries and routes by JWT `groups`.

## 2. Request lifecycle

1. User navigates to route; `authGuard` checks JWT in `AuthService`.
2. Route **resolvers** prefetch lists or single entities before component render.
3. Components call **services** (`HttpClient`) → proxied backend APIs.
4. Confirm dialogs for destructive actions (disable, delete, regenerate token).

## 3. Backend integration

| Service | Proxy prefix | Backend port (dev) | API base |
|---------|--------------|------------------|----------|
| Passport | `/passport/api/**` | 8080 | Users, profiles, roles, auth |
| Visita | `/visita/api/**` | 8081 | Domains, stats summary |
| Visita dashboard | `/visita/dashboard/**` | 8081 | Full analytics HTML |
| Engage | `/engage/api/**` | 8082 | YouTube channels, videos, comments, statistics |

Health checks (status page): `/passport/q/health`, `/visita/q/health`, `/engage/q/health` — proxied via `/passport/q/**`, `/visita/q/**`, `/engage/q/**`.

Proxy config: [`src/proxy.conf.json`](src/proxy.conf.json). Run with `ng serve --proxy-config src/proxy.conf.json`.

## 4. Routes

| Path | Component | Resolver | Role |
|------|-----------|----------|------|
| `/` | StatusViewComponent (home) | — | Authenticated |
| `/notifications` | NotificationsViewComponent | notifications | Authenticated |
| `/notifications/:notificationId` | NotificationsDetailComponent | notification | Authenticated |
| `/account` | AccountComponent | — | Authenticated |
| `/login` | LoginComponent | — | Public |
| `/login/recovery` | PasswordRecoveryComponent | — | Public |
| `/password/reset/:token` | PasswordResetComponent | — | Public |
| `/users` | UsersViewComponent | users, roles, profiles | `passport.admin` |
| `/users/new` | UsersEditComponent | roles, profiles | `passport.admin` |
| `/users/:userId` | UsersEditComponent | user, roles, profiles | `passport.admin` |
| `/profiles` | ProfileViewComponent | profiles, roles | `passport.admin` |
| `/profiles/new` | ProfileEditComponent | roles | `passport.admin` |
| `/profiles/:profileId` | ProfileEditComponent | profile, roles | `passport.admin` |
| `/roles` | RolesViewComponent | roles | `passport.admin` |
| `/roles/new` | RolesEditComponent | — | `passport.admin` |
| `/domains` | DomainsViewComponent | domains | `domains.admin` |
| `/domains/new` | DomainsEditComponent | — | `domains.admin` |
| `/domains/:domainId` | DomainsEditComponent | domain | `domains.admin` |
| `/engage/channels` | ChannelsViewComponent | channels | `engage.admin` |
| `/engage/channels/new` | ChannelsEditComponent | — | `engage.admin` |
| `/engage/channels/:channelId/reports` | ChannelReportsViewComponent | channel, reports | `engage.admin` |
| `/engage/channels/:channelId` | ChannelsEditComponent | channel | `engage.admin` |
| `/engage/channels/:channelId/comments` | CommentsViewComponent | comments | `engage.admin` |
| `/engage/videos` | VideosViewComponent | videos | `engage.admin` |
| `/engage/videos/:videoId/comments` | CommentsViewComponent | comments | `engage.admin` |
| `/engage/statistics` | EngageStatisticsViewComponent | statistics | `engage.admin` |

Routes defined in [`src/app/app.routes.ts`](src/app/app.routes.ts).

## 5. Services

| Service | File | Backend |
|---------|------|---------|
| `AuthService` | `services/auth.service.ts` | Passport `/auth/*` |
| `UsersService` | `services/users.service.ts` | Passport `/users/*` |
| `ProfileService` | `services/profile.service.ts` | Passport `/profiles/*` |
| `RolesService` | `services/roles.service.ts` | Passport `/roles/*` |
| `DomainService` | `services/domain.service.ts` | Visita `/api/domains/*` |
| `StatsService` | `services/stats.service.ts` | Visita `/api/stats/summary` |
| `PlatformStatusService` | `services/platform-status.service.ts` | Quarkus `/q/health` on each backend |
| `EngageService` | `services/engage.service.ts` | Engage `/api/channels`, `/api/videos`, `/api/statistics`, comments |
| `NotificationService` | `services/notification.service.ts` | Passport `/api/notifications`, `/api/channel-follows` |

## 6. Auth & authorization

- **Token storage:** `localStorage` key `jwt_token`.
- **Interceptor:** `auth.interceptor.ts` attaches `Authorization: Bearer …`.
- **Guard:** `auth.guard.ts` redirects unauthenticated users to `/login`.
- **Role guard:** `role.guard.ts` blocks admin routes when JWT lacks required `groups` (see route `data.roles`).
- **Role directive:** `*role="'passport.admin'"` / `*role="'domains.admin'"` — reads JWT `groups`.

Menu visibility: [`src/app/app.html`](src/app/app.html).

## 7. Component layout

```
src/app/
├── components/       # Feature views, edits, login, dialogs
├── directives/       # role.directive
├── resolvers/        # Route data prefetch
├── services/         # HTTP + auth
├── app.routes.ts
├── app.config.ts
└── app.ts / app.html # Shell (header, footer, router-outlet)
```

Dialog components: `confirm-*-dialog`, `regenerate-token.dialog`.

## 8. Styling

- Global: `src/styles.less`, `src/forms.less`, `src/dialogs.less`
- Component-scoped LESS alongside `.ts` / `.html`
- **UI pattern library:** [`docs/ui/README.md`](docs/ui/README.md) — page header, buttons, tables, forms, dialogs. Agents must read and update these docs when changing templates ([`.cursor/rules/backoffice-ui-patterns.mdc`](.cursor/rules/backoffice-ui-patterns.mdc)).

## 9. Naming

| Kind | Pattern |
|------|---------|
| Feature view | `*-view.component` or `*-view` folder |
| Feature edit | `*-edit.component` |
| Dialog | `confirm-*.dialog` / `*.dialog` |
| Service | `*.service.ts` — `XxxService` class |
| Resolver | `*.resolver.ts` — `xxxResolver` |

## 10. Adding a feature (checklist)

1. Add route + `authGuard` (+ `*role` in template if restricted).
2. Add resolver if list/detail prefetch is needed.
3. Extend or create service with typed interfaces matching backend DTOs.
4. Component + template; reuse Material patterns from siblings.
5. Confirm dialog for destructive actions.
6. Update [docs/domain-specification.md](docs/domain-specification.md) for new UI labels or concepts.
7. **Update this file** — routes, services, roles.

## 11. Development setup

### Full platform (one command)

From this repo, with Passport and Visita as sibling directories (`../passport`, `../visita`):

```bash
npm run dev:platform
# or
./scripts/dev-platform.sh
```

Starts Passport (8080), Visita (8081), Engage (8082), and Backoffice (4200). Uses `./mvnw` when present, otherwise `mvn` from PATH. Set `YOUTUBE_API_KEY` for Engage statistics. Logs: `$TMPDIR/vepo-platform/` (or `/tmp/vepo-platform/`). Login: `cto@passport.vepo.dev` / `qwas1234`.

Stop all platform services:

```bash
npm run dev:platform:stop
# or
./scripts/stop-dev-platform.sh
```

### Manual (separate terminals)

```bash
# Terminal 1 — Passport
cd ../passport && ./mvnw quarkus:dev

# Terminal 2 — Visita (for domains)
cd ../visita && mvn quarkus:dev

# Terminal 3 — Engage (YouTube statistics)
export YOUTUBE_API_KEY=your-google-api-key
cd ../engage && mvn quarkus:dev

# Terminal 4 — Backoffice
npm install
ng serve --proxy-config src/proxy.conf.json
```

Open [http://localhost:4200](http://localhost:4200). Login as `cto@passport.vepo.dev` / `qwas1234` (Passport dev seed).

## 12. CI

`.github/workflows/build-and-docker.yml`: `npm ci`, `npm test -- --watch=false --browsers=ChromeHeadless`, `npm run build -- --configuration=production`, Docker push.

## 13. Common pitfalls

- **Proxy required** — API calls use `/passport/api` and `/visita/api` prefixes; bare `localhost:8080` calls fail from the browser without proxy.
- **Role names** — must match Passport JWT groups exactly (`passport.admin`, `domains.admin`).
- **Domain form fields** — hostname and **Caminhos ignorados** (ignored path regex patterns, one per line); token managed from list view.
- **Domain API verbs** — Visita uses `PATCH` for enable/disable; keep service in sync.
- **Profile vs roles in UI** — Users are assigned **profiles**; roles are assigned to profiles, not directly to users in the current model.
