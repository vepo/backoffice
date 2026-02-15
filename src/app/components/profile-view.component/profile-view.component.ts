import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { emptyFilter, Profile, ProfileSearchFilter, ProfileService } from '../../services/profile.service';
import { Role, RoleService } from '../../services/roles.service';
import { ConfirmDeleteProfileDialog } from '../confirm-delete-profile.dialog/confirm-delete-profile.dialog';
import { ConfirmEnableProfileDialog } from '../confirm-enable-profile.dialog/confirm-enable-profile.dialog';


@Component({
    selector: 'app-profile-view',
    imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule],
    templateUrl: './profile-view.component.html'
})
export class ProfileViewComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly profileService = inject(ProfileService);
    private readonly dialog = inject(MatDialog);

    profiles: Profile[] = [];
    availableRoles: Role[] = [];
    filter: ProfileSearchFilter = emptyFilter();
    lastSearch: ProfileSearchFilter = emptyFilter();

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ profiles, availableRoles }) => {
            this.availableRoles = availableRoles;
            this.profiles = profiles;
        });
    }

    toggleRoleFilter(roleId: number) {
        const roleIndex = this.filter.roles.indexOf(roleId);
        if (roleIndex === -1) {
            this.filter.roles.push(roleId);
        } else {
            this.filter.roles.splice(roleIndex, 1);
        }
        this.updateSearch();
        this.lastSearch = { ...this.filter };
    }

    updateSearch() {
        this.profileService.search(this.filter)
            .subscribe(resp => this.profiles = resp);
    }

    filterChanged(field: string) {
        // Only trigger search if the field value has meaningfully changed
        if (field === 'name') {
            const currentValue = this.filter[field];
            const lastValue = this.lastSearch[field];

            // Type guard to ensure both values are strings
            if (typeof currentValue === 'string' && typeof lastValue === 'string') {
                // If the new value is a subset of the old value, filter locally
                if (currentValue && lastValue && currentValue.includes(lastValue)) {
                    if (field === 'name') {
                        this.profiles = this.profiles.filter(u => u.name.toLowerCase().includes(currentValue.toLowerCase()));
                    }
                    this.lastSearch = { ...this.filter };
                    return; // Skip the updateSearch call below
                }
            }
            // Otherwise, do a full search
            this.updateSearch();
        }
        this.lastSearch = { ...this.filter };
    }

    setStatusFilter(status: 'active' | 'inactive' | 'all'): void {
        switch (status) {
            case 'active':
                this.filter.disabled = false;
                break;
            case 'inactive':
                this.filter.disabled = true;
                break;
            case 'all':
                this.filter.disabled = null;
                break;
        }
        this.updateSearch();
    }

    getRoleBadgeClass(roleName: string): string {
        const name = roleName.toLowerCase();
        if (name.includes('admin') || name.includes('administrador')) return 'admin';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor')) return 'manager';
        if (name.includes('write') || name.includes('escrita')) return 'write';
        if (name.includes('read') || name.includes('leitura')) return 'read';
        if (name.includes('user') || name.includes('usuário')) return 'user';
        return 'default';
    }

    getProfileBadgeClass(profileName: string): string {
        const name = profileName.toLowerCase();
        if (name.includes('admin')) return 'admin';
        if (name.includes('manager') || name.includes('gerente')) return 'manager';
        if (name.includes('user') || name.includes('usuário')) return 'user';
        return 'default';
    }

    getProfileIcon(profileName: string): string {
        const name = profileName.toLowerCase();
        if (name.includes('admin')) return 'admin_panel_settings';
        if (name.includes('manager') || name.includes('gerente')) return 'engineering';
        if (name.includes('user') || name.includes('usuário')) return 'people';
        return 'assignment';
    }

    clearFilters(): void {
        this.filter = emptyFilter();
        this.updateSearch();
    }

    confirmDisable(profile: Profile): void {
        const dialogData = {
            data: {
                id: profile.id,
                name: profile.name,
                roles: profile.roles
            },
        };

        this.dialog
            .open(ConfirmDeleteProfileDialog, dialogData)
            .afterClosed()
            .subscribe(deleted => {
                if (deleted) {
                    this.profileService.disable(profile.id).subscribe(disabledProfile => {
                        this.profiles[this.profiles.findIndex(p => p.id == profile.id)] = disabledProfile;
                    });
                }
            });
    }

    confirmEnable(profile: Profile): void {
        const dialogData = {
            data: {
                id: profile.id,
                name: profile.name,
                roles: profile.roles
            },
        };

        this.dialog
            .open(ConfirmEnableProfileDialog, dialogData)
            .afterClosed()
            .subscribe(enabled => {
                if (enabled) {
                    this.profileService.enable(profile.id).subscribe(enabledProfile => {
                        this.profiles[this.profiles.findIndex(p => p.id == profile.id)] = enabledProfile;
                    });
                }
            });
    }

    formatDate(date: Date | string): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    }

    getRolesCount(profile: Profile): number {
        return profile.roles?.length || 0;
    }
}