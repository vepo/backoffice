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
import { Role } from "../../services/roles.service";

export interface ProfileDeleteData {
  id: number;
  name: string;
  description: string;
  roles: Role[];
}

@Component({
  selector: 'app-confirm-delete-profile-dialog',
  templateUrl: './confirm-delete-profile.dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConfirmDeleteProfileDialog {
  readonly data = inject<ProfileDeleteData>(MAT_DIALOG_DATA);
}