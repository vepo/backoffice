import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { emptyFilter, User, UserSearchFilter, UsersService } from '../../services/users.service';
import { ConfirmDeleteDialog } from '../confirm-delete.dialog/confirm-delete.dialog';
import { ConfirmEnableDialog } from '../confirm-enable.dialog/confirm-enable.dialog';

@Component({
    selector: 'app-users-view',
    imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule],
    templateUrl: './users-view.component.html'
})
export class UsersViewComponent implements OnInit {
    private readonly activatedRoute;
    private readonly usersService;
    private readonly dialog;

    users: User[] = [];
    filter: UserSearchFilter = emptyFilter();
    lastSearch: UserSearchFilter = emptyFilter();

    constructor() {
        // Move all injections to the constructor
        this.activatedRoute = inject(ActivatedRoute);
        this.usersService = inject(UsersService);
        this.dialog = inject(MatDialog);
    }


    ngOnInit() {
        this.activatedRoute.data.subscribe(({ users }) => this.users = users);
    }

    toggleRole(role: string) {
        console.debug("Toggle filter for role:", role)
        let roleIndex = this.filter.roles.indexOf(role);
        if (roleIndex == -1) {
            this.filter.roles.push(role);
            this.users = this.users.filter(u => u.roles.indexOf(role) != -1);
        } else {
            console.debug("Removing role...", roleIndex, this.filter.roles);
            this.filter.roles.splice(roleIndex, 1);
            console.debug("Role removed!", this.filter.roles);
            this.updateSearch();
        }
        this.lastSearch = this.filter;
    }

    updateSearch() {
        this.usersService.search(this.filter)
            .subscribe(resp => this.users = resp);
    }

    filterChanged(value: string) {
        switch (value) {
            case 'name':
                console.debug("Is new name substring of old name?", this.lastSearch.name, this.filter.name);
                if (this.filter.name != '' && (this.lastSearch.name == '' || this.lastSearch.name.indexOf(this.filter.name))) {
                    console.debug('filtering', this.filter);
                    this.users = this.users.filter(u => u.name.indexOf(this.filter.name) != -1);
                } else {
                    console.debug('Searching again...', this.filter)
                    this.updateSearch();
                }
                break;
            case 'email':
                if (this.filter.email != '' && (this.lastSearch.email == '' || this.lastSearch.email.indexOf(this.filter.email))) {
                    this.users = this.users.filter(u => u.email.indexOf(this.filter.email) != -1);
                } else {
                    this.updateSearch();
                }
                break;
        }
        this.lastSearch = this.filter;
    }

    // Add these missing method stubs for TypeScript compilation
    getAdminCount(): number {
        return this.users.filter(u => u.roles.includes('admin')).length;
    }

    getManagerCount(): number {
        return this.users.filter(u => u.roles.includes('project-manager')).length;
    }

    getUserCount(): number {
        return this.users.filter(u => u.roles.includes('user')).length;
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

    resetPassword(entry: User): void {
        console.log('View details for:', entry);
    }

    confirmDisable(entry: User): void {
        const dialogData = {
            data: {
                id: entry.id,
                username: entry.username,
                email: entry.email,
                name: entry.name,
                roles: entry.roles
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
                roles: entry.roles
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