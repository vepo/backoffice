import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Profile, ProfileService } from '../../services/profile.service';
import { Role } from '../../services/roles.service';

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html',
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
export class ProfileEditComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly profileService = inject(ProfileService);
    private readonly router = inject(Router);

    editMode: boolean = false;
    profileId: number | null = null;
    availableRoles: Role[] = [];
    
    profileForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        roleIds: new FormControl([] as number[], [Validators.required, Validators.minLength(1)])
    });

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ profile, availableRoles }) => {
            console.debug("Profile data: ", profile);
            this.availableRoles = availableRoles;
            this.editMode = profile != null;
            this.profileId = profile?.id || null;

            if (profile) {
                this.profileForm.patchValue({
                    name: profile.name,
                    roleIds: (profile.roles as Role[]).map(r => r.id) || []
                });
            }

            if (this.editMode) {
                this.profileForm.markAllAsTouched();
            }
        });
    }

    toggle(role: Role): void {
        const currentRoleIds = this.profileForm.get('roleIds')?.value || [];
        const roleIndex = currentRoleIds.indexOf(role.id);

        let newRoleIds: number[];
        if (roleIndex === -1) {
            newRoleIds = [...currentRoleIds, role.id];
        } else {
            newRoleIds = [...currentRoleIds];
            newRoleIds.splice(roleIndex, 1);
        }

        console.debug("Roles", newRoleIds);
        this.profileForm.get('roleIds')?.setValue(newRoleIds);
        this.profileForm.get('roleIds')?.markAsTouched();
    }

    cancel(): void {
        this.router.navigate(['/', 'profiles']);
    }

    isRoleSelected(role: Role): boolean {
        const currentRoleIds = this.profileForm.get('roleIds')?.value || [];
        return currentRoleIds.indexOf(role.id) !== -1;
    }

    getRoleBadgeClass(role: Role) {
        return this.getBadge(role.name.toLowerCase());
    }

    getRoleIcon(role: Role) {
        return this.getIcon(role.name.toLowerCase());
    }

    getIcon(name: string) {
        if (name.includes('admin') || name.includes('administrador')) return 'admin_panel_settings';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor') || name.includes('editor')) return 'assignment_turned_in';
        if (name.includes('write') || name.includes('escrita')) return 'edit_note';
        if (name.includes('read') || name.includes('leitura')) return 'visibility';
        if (name.includes('user') || name.includes('usuário')) return 'person';
        return 'assignment';
    }

    getBadge(name: string) {
        if (name.includes('admin') || name.includes('administrador')) return 'admin';
        if (name.includes('manager') || name.includes('gerente') || name.includes('gestor') || name.includes('editor')) return 'manager';
        if (name.includes('write') || name.includes('escrita')) return 'write';
        if (name.includes('read') || name.includes('leitura')) return 'read';
        if (name.includes('user') || name.includes('usuário')) return 'user';
        return 'default';
    }

    save(): void {
        console.log("Save call!");

        this.profileForm.markAllAsTouched();

        if (this.profileForm.invalid) {
            console.log("Form is invalid");
            return;
        }

        const { name, roleIds } = this.profileForm.value;
        if (!name || !roleIds) return;

        if (this.editMode && this.profileId) {
            this.profileService.update(this.profileId, { name, roleIds })
                .subscribe({
                    next: (profile) => {
                        console.log("Profile updated:", profile);
                        this.router.navigate(['/', 'profiles']);
                    },
                    error: (error) => {
                        console.error("Error updating profile:", error);
                    }
                });
        } else {
            this.profileService.create({ name, roleIds })
                .subscribe({
                    next: (profile) => {
                        console.log("Profile created:", profile);
                        this.router.navigate(['/', 'profiles']);
                    },
                    error: (error) => {
                        console.error("Error creating profile:", error);
                    }
                });
        }
    }
}