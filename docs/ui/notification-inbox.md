# Notification inbox

List and detail screens for Passport **notifications**, plus shell bell badge.

## Reference

- List: [`notifications-view.component.html`](../../src/app/components/notifications-view/notifications-view.component.html)
- Detail: [`notifications-detail.component.html`](../../src/app/components/notifications-detail/notifications-detail.component.html)
- Shell badge: [`app.html`](../../src/app/app.html)

## List page (`/notifications`)

Patterns: page-layout, page-header (refresh only), stats-grid, filter-card (read filter), table-card, empty-state, row-actions.

| Element | Rule |
|---------|------|
| Header | Title **Notificações**; single primary **Atualizar** button |
| Filter | Radio: **Todas** / **Não lidas** → `GET /passport/api/notifications?unread=true` |
| Row link | Title + description link to detail route |
| Row actions | Open, mark read (`drafts`), mark unread (`mark_email_unread`) |
| Empty state | Context message for filter (no unread vs no follows) |

## Detail page (`/notifications/:id`)

Patterns: page-layout, back-link, page-header (mark read/unread), stats-grid, table-card (items), report `pre` block.

| Element | Rule |
|---------|------|
| Auto-read | Opening detail via resolver GET marks notification read on server |
| Report | Pretty-print JSON in `.report-block` when `report` field is JSON |
| Items table | One row per notification item (YouTube API call) |

## Shell bell

| Element | Rule |
|---------|------|
| Visibility | All authenticated users (no `*role`) |
| Badge | Red count from `GET /passport/api/notifications/unread-count` |
| Refresh | On navigation and after read/unread actions (`NotificationService.unreadCountChanged$`) |

## Channel follow toggle

On **Canais** list (`/engage/channels`), column **Notificações** — bell icon toggles follow/unfollow. Same option on **Editar Canal** form.

## Channel reports

Route `/engage/channels/:channelId/reports` — list all sync run reports for the channel (from Passport). Open row → `/notifications/:id` for full detail.

Grid action: **summarize** icon in row actions.

## Anti-patterns

- Do not require `engage.admin` for inbox — any authenticated user may follow channels and receive notifications.
- Do not add navigation buttons in list header; bell + menu are sufficient.
