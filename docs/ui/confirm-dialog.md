# Confirm dialog

Modal confirmation before destructive or irreversible API calls.

## Reference

[`confirm-delete-role.dialog.html`](../../src/app/components/confirm-delete-role.dialog/confirm-delete-role.dialog.html)

## Structure

1. `mat-dialog-title` with warning icon + action name
2. `mat-dialog-content`:
   - `confirmation-message` — short alert
   - `user-info` / entity details grid
   - `warning-note` — impact bullet list
3. `mat-dialog-actions`:
   - Cancel: `btn btn-outline` + `mat-dialog-close`
   - Confirm: `btn btn-danger` + `[mat-dialog-close]="true"` for deletes

## Rules

1. One dialog component per domain action (`confirm-delete-channel.dialog`, etc.).
2. Export a `*Data` interface for `MAT_DIALOG_DATA`.
3. Parent opens via `MatDialog.open()` and handles `afterClosed()` → service call.
4. Styles inherit from [`dialogs.less`](../../src/dialogs.less) — do not inline dialog CSS.
5. Dialog copy in **pt-BR**; entity names from domain spec.
