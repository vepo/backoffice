import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ChannelDeleteData {
  id: number;
  youtubeId: string;
}

@Component({
  selector: 'app-confirm-delete-channel-dialog',
  templateUrl: './confirm-delete-channel.dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule
  ]
})
export class ConfirmDeleteChannelDialog {
  readonly data = inject<ChannelDeleteData>(MAT_DIALOG_DATA);
}
