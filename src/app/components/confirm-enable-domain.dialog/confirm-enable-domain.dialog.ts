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

export interface DomainEnableData {
    id: number;
    hostname: string;
}

@Component({
    selector: 'app-confirm-enable-domain-dialog',
    templateUrl: './confirm-enable-domain.dialog.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatIconModule
    ]
})
export class ConfirmEnableDomainDialog {
    readonly data = inject<DomainEnableData>(MAT_DIALOG_DATA);
}