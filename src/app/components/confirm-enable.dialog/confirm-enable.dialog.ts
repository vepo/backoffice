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

export interface UserEnableData {
    id: number;
    username: string;
    email: string;
    name: string;
    roles: string[];
    disabledAt?: Date;
}

@Component({
    selector: 'app-confirm-enable-dialog',
    templateUrl: './confirm-enable.dialog.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatIconModule
    ]
})
export class ConfirmEnableDialog {
    readonly data = inject<UserEnableData>(MAT_DIALOG_DATA);
}