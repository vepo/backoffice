import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, RoleService } from '../../services/roles.service';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class RolesEditComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);

  editMode: boolean = false;
  roleId: number | null = null;

  roleForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZÀ-ÿ.-_]+$/) // Apenas letras e espaços
    ])
  });

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ role }) => {
      console.debug("Role data: ", role);
      this.editMode = role != null;
      this.roleId = role?.id || null;

      if (role) {
        this.roleForm.patchValue({
          name: role.name
        });
      }

      if (this.editMode) {
        this.roleForm.markAllAsTouched();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/', 'roles']);
  }

  save(): void {
    console.log("Save call!");

    this.roleForm.markAllAsTouched();

    if (this.roleForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    const { name } = this.roleForm.value;
    if (!name) return;

    if (this.editMode && this.roleId) {
      this.roleService.update(this.roleId, { name })
        .subscribe({
          next: (role) => {
            console.log("Role updated:", role);
            this.router.navigate(['/', 'roles']);
          },
          error: (error) => {
            console.error("Error updating role:", error);
          }
        });
    } else {
      this.roleService.create({ name })
        .subscribe({
          next: (role) => {
            console.log("Role created:", role);
            this.router.navigate(['/', 'roles']);
          },
          error: (error) => {
            console.error("Error creating role:", error);
          }
        });
    }
  }
}