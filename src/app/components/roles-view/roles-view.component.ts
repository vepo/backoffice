import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Role, RoleService, emptyFilter, RoleSearchFilter } from '../../services/roles.service';
import { ConfirmDeleteRoleDialog } from '../confirm-delete-role.dialog/confirm-delete-role.dialog';

@Component({
    selector: 'app-roles-view',
    imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule],
    templateUrl: './roles-view.component.html'
})
export class RolesViewComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly roleService = inject(RoleService);
    private readonly dialog = inject(MatDialog);

    roles: Role[] = [];
    filter: RoleSearchFilter = emptyFilter();
    lastSearch: RoleSearchFilter = emptyFilter();

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ roles }) => {
            this.roles = roles;
        });
    }

    updateSearch() {
        this.roleService.search(this.filter)
            .subscribe(resp => this.roles = resp);
    }

    filterChanged() {
        const currentValue = this.filter.name;
        const lastValue = this.lastSearch.name;

        if (typeof currentValue === 'string' && typeof lastValue === 'string') {
            if (currentValue && lastValue && currentValue.includes(lastValue)) {
                this.roles = this.roles.filter(r =>
                    r.name.toLowerCase().includes(currentValue.toLowerCase())
                );
                this.lastSearch = { ...this.filter };
                return;
            }
        }
        this.updateSearch();
        this.lastSearch = { ...this.filter };
    }

    clearFilters(): void {
        this.filter = emptyFilter();
        this.updateSearch();
    }

    confirmDelete(role: Role): void {
        const dialogData = {
            data: {
                id: role.id,
                name: role.name
            }
        };

        this.dialog
            .open(ConfirmDeleteRoleDialog, dialogData)
            .afterClosed()
            .subscribe(confirmed => {
                if (confirmed) {
                    this.roleService.delete(role.id).subscribe(() => {
                        this.roles = this.roles.filter(r => r.id !== role.id);
                    });
                }
            });
    }

    getRoleBadgeClass(role: Role): string {
        const name = role.name.toLowerCase();
        if (name.includes('admin') || name.includes('administrador')) return 'admin';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor') || name.includes('editor')) return 'manager';
        if (name.includes('write') || name.includes('escrita')) return 'write';
        if (name.includes('read') || name.includes('leitura')) return 'read';
        if (name.includes('user') || name.includes('usuário')) return 'user';
        return 'default';
    }

    getRoleIcon(role: Role): string {
        const name = role.name.toLowerCase();
        if (name.includes('admin') || name.includes('administrador')) return 'admin_panel_settings';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor') || name.includes('editor')) return 'assignment_turned_in';
        if (name.includes('write') || name.includes('escrita')) return 'edit_note';
        if (name.includes('read') || name.includes('leitura')) return 'visibility';
        if (name.includes('user') || name.includes('usuário')) return 'person';
        return 'assignment';
    }

}