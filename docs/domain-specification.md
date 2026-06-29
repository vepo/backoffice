# Backoffice — Domain Specification

Canonical domain language for Backoffice, the web admin shell for Passport and Visita. Developers, reviewers, and AI agents must align components, services, tests, and UI copy with this document.

**Related references:** [ARCHITECTURE.md](../ARCHITECTURE.md). Backend domain specs: Passport [domain-specification.md](../../passport/docs/domain-specification.md), Visita [domain-specification.md](../../visita/docs/domain-specification.md).

**Maintenance:** Update this file before merging when UI or shell concepts change (see [.cursor/rules/domain-model.mdc](../.cursor/rules/domain-model.mdc)).

---

## Context

Backoffice is an **Angular** SPA that administers platform data by calling backend APIs. It does not own persistence; it reflects Passport and Visita domain terms in UI and service interfaces.

---

## Ubiquitous Language

### Shell

| Term | Meaning | Code / notes |
|------|---------|--------------|
| **Backoffice** | Admin web application (this repo). | — |
| **Session** | Browser state with stored JWT after login. | `AuthService`, `jwt_token` |
| **Menu** | Header navigation filtered by roles. | `app.html`, `*role` directive |
| **Platform status** | Status da Plataforma — microservice health dashboard. | `StatusViewComponent`, `/`, `PlatformStatusService` |
| **Home** | Início — Visita summary KPIs, health, quick links. | `StatusViewComponent`, `/` |
| **Stats summary** | Visita analytics KPI cards on home. | `StatsService`, `GET /visita/api/stats/summary` |
| **Account** | Conta — current user and change password. | `AccountComponent`, `/account` |
| **Auth guard** | Blocks routes without valid JWT. | `authGuard` |

### Authentication UI

| Term | Label (pt-BR) | Code / notes |
|------|---------------|--------------|
| **Login** | Acessar | `LoginComponent`, `/login` |
| **Password recovery** | (recovery form) | `PasswordRecoveryComponent`, `/login/recovery` |
| **Password reset** | (reset form) | `PasswordResetComponent`, `/password/reset/:token` |
| **Logout** | Sair | `AuthService.logout()` |
| **Change password** | Alterar senha | `AccountComponent`, `POST /auth/change-password` |

### User administration (Passport)

| Term | Label (pt-BR) | Code / notes |
|------|---------------|--------------|
| **User** | Usuário | `UsersService`, `User` interface |
| **User list** | Usuários | `UsersViewComponent`, `/users` |
| **Create user** | Novo usuário | `/users/new` |
| **Edit user** | (edit form) | `/users/:userId` |
| **Enable user** | Confirm enable dialog | `confirm-enable.dialog` |
| **Disable user** | Confirm disable dialog | `confirm-delete.dialog` |
| **Assign profiles** | Profile multi-select on user form | `profileIds` in request |

### Profile administration (Passport)

| Term | Label (pt-BR) | Code / notes |
|------|---------------|--------------|
| **Profile** | Perfil | `ProfileService` |
| **Profile list** | Perfis | `ProfileViewComponent`, `/profiles` |
| **Assign roles** | Role multi-select on profile form | `AssignRoles` API |
| **Enable profile** | Confirm enable | `confirm-enable-profile.dialog` |
| **Disable profile** | Confirm disable | `confirm-delete-profile.dialog` |

### Role administration (Passport)

| Term | Label (pt-BR) | Code / notes |
|------|---------------|--------------|
| **Role** | Função | `RolesService` |
| **Role list** | Funções | `RolesViewComponent`, `/roles` |
| **Delete role** | Confirm delete | `confirm-delete-role.dialog` |

### Domain administration (Visita)

| Term | Label (pt-BR) | Code / notes |
|------|---------------|--------------|
| **Domain** | Domínio | `DomainService`, `Domain` interface |
| **Domain list** | Domínios | `DomainsViewComponent`, `/domains` |
| **Hostname** | Hostname field | `Domain.hostname` |
| **Tracking token** | Token field (read-only after create) | `Domain.token` |
| **Ignored path pattern** | Caminhos ignorados — one regex per line on domain form | `Domain.ignoredPathPatterns` |
| **Enable domain** | Confirm enable | `confirm-enable-domain.dialog` |
| **Disable domain** | Confirm disable | `confirm-disable-domain.dialog` |
| **Regenerate token** | Regenerate tracking token | `regenerate-token.dialog` |

### Authorization (UI)

| Role (JWT group) | Menu entries |
|------------------|--------------|
| `passport.admin` | Usuários, Perfis, Funções |
| `domains.admin` | Domínios, Visita stats on home |
| `Domain.Stats.Viewer` | Visita stats on home |
| `engage.admin` | Canais, Vídeos, Estatísticas YouTube |

### Engage administration (YouTube)

| Term | Label (pt-BR) | Code / notes |
|------|---------------|--------------|
| **YouTube statistics** | Estatísticas do YouTube | `EngageStatisticsViewComponent`, `/engage/statistics` |
| **Channel** | Canal | Engage `Channel`; `ChannelsViewComponent`, `/engage/channels` |
| **Connected channel** | Canal conectado | Checkbox + API key in `ChannelsEditComponent` |
| **YouTube API key** | Chave da API YouTube | Password field in channel form; write-only |
| **Video** | Vídeo | `VideosViewComponent`, `/engage/videos` |
| **Comment count** | Comentários | Column on videos list; `Video.commentCount` from Engage |
| **Comment** | Comentário | `CommentsViewComponent`, `/engage/videos/:id/comments`, `/engage/channels/:id/comments` |
| **Comment word cloud** | Nuvem de Palavras | `CommentsViewComponent` word cloud card; Engage `GET .../comments/word-cloud` |
| **Add channel** | Novo Canal | `ChannelsViewComponent` header; empty state: **Criar Novo Canal**; `/engage/channels/new` |
| **Follow channel** | Receber notificações deste canal | Bell toggle on `ChannelsViewComponent`; also on `ChannelsEditComponent` |
| **Channel reports** | Relatórios do canal | `ChannelReportsViewComponent`, `/engage/channels/:id/reports` |

### Notifications (Passport)

| Term | Label (pt-BR) | Code / notes |
|------|---------------|--------------|
| **Notification** | Notificação | `NotificationService`, `/notifications` |
| **Notification inbox** | Notificações | `NotificationsViewComponent`, shell bell icon |
| **Mark as read** | Marcar como lida | Detail GET (auto) or PATCH `/read`; list row action |
| **Mark all as read** | Marcar todas como lidas | Filter action on inbox; PATCH `/read-all` |
| **Mark as unread** | Marcar como não lida | PATCH `/unread`; list/detail actions |
| **Follow channel** | Seguir canal / Receber notificações deste canal | `NotificationService.followChannel()` |

---

## Invariants

1. All authenticated routes require a valid JWT except login, recovery, and password reset.
2. UI labels for managed entities must match Passport/Visita domain terms (User, Profile, Role, Domain).
3. Destructive actions use a **confirm dialog** before calling the API.
4. Service interfaces mirror backend JSON field names (`profileIds`, not internal DB ids in forms without resolver).
