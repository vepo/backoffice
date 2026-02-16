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

export interface DomainDisableData {
    id: number;
    hostname: string;
}

@Component({
    selector: 'app-confirm-disable-domain-dialog',
    templateUrl: './confirm-disable-domain.dialog.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatIconModule
    ]
})
export class ConfirmDisableDomainDialog {
    readonly data = inject<DomainDisableData>(MAT_DIALOG_DATA);
}