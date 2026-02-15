import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Profile, ProfileService } from '../../services/profile.service';
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
    private readonly roleService = inject(RoleService);

    profiles: Profile[] = [];
    availableRoles: Role[] = [];

    filter = {
        name: '',
        roleId: null as number | null
    };

    lastFilter = {
        name: '',
        roleId: null as number | null
    };

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ profiles, availableRoles }) => {
            this.availableRoles = availableRoles;
            this.profiles = profiles;
        });
    }

    toggleRoleFilter(roleId: number) {
        if (this.filter.roleId === roleId) {
            this.filter.roleId = null;
        } else {
            this.filter.roleId = roleId;
        }
        this.updateSearch();
        this.lastFilter = { ...this.filter };
    }

    updateSearch() {
        this.profileService.search(this.filter)
            .subscribe(resp => this.profiles = resp);
    }

    filterChanged() {
        const currentValue = this.filter.name;
        const lastValue = this.lastFilter.name;

        if (typeof currentValue === 'string' && typeof lastValue === 'string') {
            if (currentValue && lastValue && currentValue.includes(lastValue)) {
                this.profiles = this.profiles.filter(p =>
                    p.name.toLowerCase().includes(currentValue.toLowerCase())
                );
                this.lastFilter = { ...this.filter };
                return;
            }
        }
        this.updateSearch();
        this.lastFilter = { ...this.filter };
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
        this.filter = {
            name: '',
            roleId: null
        };
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