import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Profile, ProfileService } from '../../services/profile.service';
import { Role, RoleService } from '../../services/roles.service';
import { emptyFilter, User, UserSearchFilter, UsersService } from '../../services/users.service';
import { ConfirmDeleteDialog } from '../confirm-delete.dialog/confirm-delete.dialog';
import { ConfirmEnableDialog } from '../confirm-enable.dialog/confirm-enable.dialog';

@Component({
    selector: 'app-users-view',
    imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule],
    templateUrl: './users-view.component.html'
})
export class UsersViewComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly usersService = inject(UsersService);
    private readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);
    private readonly profileService = inject(ProfileService);
    private readonly roleService = inject(RoleService);

    users: User[] = [];
    filter: UserSearchFilter = emptyFilter();
    lastSearch: UserSearchFilter = emptyFilter();

    // Add available profiles for filtering
    availableProfiles: Profile[] = [];
    availableRoles: Role[] = [];

    constructor() { }

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ users, availableRoles, availableProfiles }) => {
            this.availableProfiles = availableProfiles;
            this.availableRoles = availableRoles
            this.users = users;
            // Load profiles for filtering
        });
    }

    toggleProfile(profileId: number) {
        const profileIndex = this.filter.profiles.indexOf(profileId);
        if (profileIndex === -1) {
            this.filter.profiles.push(profileId);
        } else {
            this.filter.profiles.splice(profileIndex, 1);
        }
        this.updateSearch();
        this.lastSearch = { ...this.filter };
    }

    toggleRole(roleId: number) {
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
        this.usersService.search(this.filter)
            .subscribe(resp => this.users = resp);
    }

    filterChanged(field: string) {
        // Only trigger search if the field value has meaningfully changed
        if (field === 'name' || field === 'email' || field === 'username') {
            const currentValue = this.filter[field];
            const lastValue = this.lastSearch[field];

            // Type guard to ensure both values are strings
            if (typeof currentValue === 'string' && typeof lastValue === 'string') {
                // If the new value is a subset of the old value, filter locally
                if (currentValue && lastValue && currentValue.includes(lastValue)) {
                    if (field === 'name') {
                        this.users = this.users.filter(u => u.name.toLowerCase().includes(currentValue.toLowerCase()));
                    } else if (field === 'email') {
                        this.users = this.users.filter(u => u.email.toLowerCase().includes(currentValue.toLowerCase()));
                    } else if (field === 'username') {
                        this.users = this.users.filter(u => u.username.toLowerCase().includes(currentValue.toLowerCase()));
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

    getProfileBadgeClass(profileName: string): string {
        const name = profileName.toLowerCase();
        if (name.includes('admin')) return 'admin';
        if (name.includes('manager') || name.includes('gerente')) return 'manager';
        if (name.includes('user') || name.includes('usuário')) return 'user';
        return 'default';
    }

    // Helper method to check if user has a specific profile
    userHasProfile(user: User, profileName: string): boolean {
        return user.profiles.some(profile =>
            profile.name.toLowerCase().includes(profileName.toLowerCase())
        );
    }

    loadRoles(profiles: Profile[]): Role[] {
        var profileRoles: Role[] = [];
        this.availableProfiles.forEach(p => {
            if (profiles.find(profile => profile.id == p.id)) {
                p.roles.forEach(role => {
                    if (!profileRoles.find(r => r.id == role.id)) {
                        profileRoles.push(role);
                    }
                });
            }
        });
        return profileRoles;
    }

    toggleDisabled() {
        this.filter.disabled = !this.filter.disabled;
        this.updateSearch();
    }

    getAdminCount(): number {
        return this.users.filter(u => this.userHasProfile(u, 'admin')).length;
    }

    getManagerCount(): number {
        return this.users.filter(u => this.userHasProfile(u, 'manager') || this.userHasProfile(u, 'gerente')).length;
    }

    getUserCount(): number {
        // Users without admin or manager profiles
        return this.users.filter(u =>
            !this.userHasProfile(u, 'admin') &&
            !this.userHasProfile(u, 'manager') &&
            !this.userHasProfile(u, 'gerente')
        ).length;
    }

    formatDate(date: Date | string): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    }

    clearFilters(): void {
        this.filter = emptyFilter();
        this.updateSearch();
    }

    exportToCSV(): void {
        // Implementation would go here
        console.log('Export to CSV');
    }

    resetPassword(user: User): void {
        this.authService.recovery(user.email).subscribe(resp => console.log(resp));
    }

    confirmDisable(entry: User): void {
        const dialogData = {
            data: {
                id: entry.id,
                username: entry.username,
                email: entry.email,
                name: entry.name,
                roles: this.loadRoles(entry.profiles),
                profiles: entry.profiles // Changed from roles to profiles
            },
        };
        this.dialog
            .open(ConfirmDeleteDialog, dialogData)
            .afterClosed()
            .subscribe(deleted => {
                if (deleted) {
                    this.usersService.disable(entry.id).subscribe(user => {
                        let index = this.users.findIndex(u => u.id == user.id);
                        this.users[index] = user;
                    });
                }
            });
    }

    confirmEnable(entry: User): void {
        const dialogData = {
            data: {
                id: entry.id,
                username: entry.username,
                email: entry.email,
                name: entry.name,
                profiles: entry.profiles // Changed from roles to profiles
            },
        };
        this.dialog
            .open(ConfirmEnableDialog, dialogData)
            .afterClosed()
            .subscribe(deleted => {
                if (deleted) {
                    this.usersService.enable(entry.id).subscribe(user => {
                        let index = this.users.findIndex(u => u.id == user.id);
                        this.users[index] = user;
                    });
                }
            });
    }

    previousPage(): void {
        // Implementation would go here
        console.log('Previous page');
    }

    nextPage(): void {
        // Implementation would go here
        console.log('Next page');
    }

    bulkAssignRoles(): void {
        // Implementation would go here
        console.log('Bulk assign roles');
    }

    exportReport(): void {
        // Implementation would go here
        console.log('Export report');
    }

    importUsers(): void {
        // Implementation would go here
        console.log('Import users');
    }

    // Add these properties for pagination
    totalUsers: number = 0;
    currentPage: number = 1;
    totalPages: number = 1;
}