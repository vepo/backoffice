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
import { Profile } from "../../services/profile.service";

export interface UserEnableData {
    id: number;
    username: string;
    email: string;
    name: string;
    roles: Role[];
    profiles: Profile[];
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

    getRoleBadgeClass(role: Role) {
        const name = role.name.toLowerCase();
        if (name.includes('admin') || name.includes('administrador')) return 'admin';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor') || name.includes('editor')) return 'manager';
        if (name.includes('write') || name.includes('escrita')) return 'user';
        if (name.includes('viewer') || name.includes('leitura')) return 'user';
        if (name.includes('read') || name.includes('leitura')) return 'user';
        if (name.includes('user') || name.includes('usuário')) return 'user';
        return 'default';
    }
}