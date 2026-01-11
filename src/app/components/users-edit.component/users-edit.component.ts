import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
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
        MatIconModule
    ]
})
export class UsersEditComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly usersService = inject(UsersService);
    private readonly router = inject(Router);

    editMode: boolean = false;
    userId: number | null = null;
    userForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email, Validators.required]),
        roles: new FormControl([] as string[], [Validators.required, Validators.minLength(1)])
    });

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ user }) => {
            console.debug("User data: ", user);
            this.editMode = user != null;
            this.userId = user?.id || null;

            if (user) {
                this.userForm.patchValue({
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    roles: user.roles || []
                });
            }

            // Mark fields as touched to show validation errors if needed
            if (this.editMode) {
                this.userForm.markAllAsTouched();
            }
        });
    }

    toggle(role: string): void {
        const currentRoles = this.userForm.get('roles')?.value || [];
        const roleIndex = currentRoles.indexOf(role);

        let newRoles: string[];
        if (roleIndex === -1) {
            newRoles = [...currentRoles, role];
        } else {
            newRoles = [...currentRoles];
            newRoles.splice(roleIndex, 1);
        }

        console.debug("Roles", newRoles);
        this.userForm.get('roles')?.setValue(newRoles);
        this.userForm.get('roles')?.markAsTouched();
    }

    cancel(): void {
        this.router.navigate(['/', 'users']);
    }

    isRoleSelected(role: string): boolean {
        const currentRoles = this.userForm.get('roles')?.value || [];
        return currentRoles.indexOf(role) !== -1;
    }

    save(): void {
        console.log("Save call!");

        // Mark all fields as touched to trigger validation display
        this.userForm.markAllAsTouched();

        if (this.userForm.invalid) {
            console.log("Form is invalid");
            return;
        }

        const { name, username, email, roles } = this.userForm.value;
        if (!name || !username || !email || !roles) return;

        if (this.editMode && this.userId) {
            this.usersService.update(this.userId, { name, username, email, roles })
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
            this.usersService.create({ name, username, email, roles })
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