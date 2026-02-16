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

export interface RegenerateTokenData {
    id: number;
    hostname: string;
    currentToken: string;
}

@Component({
    selector: 'app-regenerate-token-dialog',
    templateUrl: './regenerate-token.dialog.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatIconModule
    ]
})
export class RegenerateTokenDialog {
    readonly data = inject<RegenerateTokenData>(MAT_DIALOG_DATA);

    maskToken(token: string): string {
        if (!token) return '';
        if (token.length <= 8) return token;
        return token.substring(0, 4) + '••••••••' + token.substring(token.length - 4);
    }
}