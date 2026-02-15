import { Component, inject } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';

export interface RoleDeleteData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-confirm-delete-role-dialog',
  templateUrl: './confirm-delete-role.dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConfirmDeleteRoleDialog {
  readonly data = inject<RoleDeleteData>(MAT_DIALOG_DATA);
}