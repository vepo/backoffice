import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Profile } from '../../services/profile.service';
import { Role } from '../../services/roles.service';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-users-edit',
    templateUrl: './users-edit.component.html',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        RouterLink
    ]
})
export class UsersEditComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly usersService = inject(UsersService);
    private readonly router = inject(Router);

    editMode: boolean = false;
    userId: number | null = null;
    availableProfiles: Profile[] = [];
    availableRoles: Role[] = [];
    userForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email, Validators.required]),
        profileIds: new FormControl([] as number[], [Validators.required, Validators.minLength(1)])
    });

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ user, availableRoles, availableProfiles }) => {
            console.debug("User data: ", user);
            this.availableProfiles = availableProfiles;
            this.availableRoles = availableRoles
            this.editMode = user != null;
            this.userId = user?.id || null;

            if (user) {
                this.userForm.patchValue({
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    profileIds: (user.profiles as Profile[]).map(p => p.id) || []
                });
            }

            // Mark fields as touched to show validation errors if needed
            if (this.editMode) {
                this.userForm.markAllAsTouched();
            }
        });
    }

    toggle(profile: Profile): void {
        const currentProfileIds = this.userForm.get('profileIds')?.value || [];
        const profileIndex = currentProfileIds.indexOf(profile.id);

        let newProfileIds: number[];
        if (profileIndex === -1) {
            newProfileIds = [...currentProfileIds, profile.id];
        } else {
            newProfileIds = [...currentProfileIds];
            newProfileIds.splice(profileIndex, 1);
        }

        console.debug("Profiles", newProfileIds);
        this.userForm.get('profileIds')?.setValue(newProfileIds);
        this.userForm.get('profileIds')?.markAsTouched();
    }

    cancel(): void {
        this.router.navigate(['/', 'users']);
    }

    getRoleBadgeClass(role: Role) {
        return this.getBadge(role.name.toLowerCase());
    }
    
    getProfileBadgeClass(profile: Profile) {
        return this.getBadge(profile.name.toLowerCase());
    }

    getProfileIcon(profile: Profile) {
        return this.getIcon(profile.name.toLowerCase());
    }
    
    getRoleIcon(role: Role) {
        return this.getIcon(role.name.toLowerCase());
    }

    getIcon(name: string) {
        if (name.includes('admin') || name.includes('administrador')) return 'admin_panel_settings';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor') || name.includes('editor')) return 'assignment_turned_in';
        if (name.includes('write') || name.includes('escrita') || name.includes('viewer')) return 'laptop_windows';
        if (name.includes('read') || name.includes('leitura')) return 'laptop_windows';
        if (name.includes('user') || name.includes('usuário')) return 'laptop_windows';
        return 'person';
    }

    getBadge(name: string) {
        if (name.includes('admin') || name.includes('administrador')) return 'admin';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor') || name.includes('editor')) return 'manager';
        if (name.includes('write') || name.includes('escrita') || name.includes('viewer')) return 'user';
        if (name.includes('read') || name.includes('leitura')) return 'user';
        if (name.includes('user') || name.includes('usuário')) return 'user';
        return 'default';
    }

    loadRoles(): Role[] {
        var selectedRoles: Role[] = [];
        if (this.userForm.value.profileIds) {
            this.availableProfiles
                .filter(p => this.userForm.value.profileIds?.indexOf(p.id)!= -1)
                .forEach(p => p.roles.forEach(role => {
                    if(selectedRoles.findIndex(r => r.id == role.id) == -1) {
                        selectedRoles.push(role);
                    }
                }))
        }
        return selectedRoles;
    }

    isProfileSelected(profile: Profile): boolean {
        const currentProfileIds = this.userForm.get('profileIds')?.value || [];
        return currentProfileIds.indexOf(profile.id) !== -1;
    }

    save(): void {
        console.log("Save call!");

        // Mark all fields as touched to trigger validation display
        this.userForm.markAllAsTouched();

        if (this.userForm.invalid) {
            console.log("Form is invalid");
            return;
        }

        const { name, username, email, profileIds } = this.userForm.value;
        if (!name || !username || !email || !profileIds) return;

        if (this.editMode && this.userId) {
            this.usersService.update(this.userId, { name, username, email, profileIds })
                .subscribe({
                    next: (user) => {
                        console.log("User updated:", user);
                        this.router.navigate(['/', 'users']);
                    },
                    error: (error) => {
                        console.error("Error updating user:", error);
                        // Handle error appropriately
                    }
                });
        } else {
            this.usersService.create({ name, username, email, profileIds })
                .subscribe({
                    next: (user) => {
                        console.log("User created:", user);
                        this.router.navigate(['/', 'users']);
                    },
                    error: (error) => {
                        console.error("Error creating user:", error);
                        // Handle error appropriately
                    }
                });
        }
    }
}