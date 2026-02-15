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
import { Role } from "../../services/roles.service";

export interface ProfileEnableData {
  id: number;
  name: string;
  description: string;
  roles: Role[];
}

@Component({
  selector: 'app-confirmd-enable-profile-dialog',
  templateUrl: './confirm-enable-profile.dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConfirmEnableProfileDialog {
  readonly data = inject<ProfileEnableData>(MAT_DIALOG_DATA);
}