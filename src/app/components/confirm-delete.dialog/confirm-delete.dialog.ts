import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface UserDeleteData {
  id: number;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete.dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConfirmDeleteDialog {
  readonly data = inject<UserDeleteData>(MAT_DIALOG_DATA);
}