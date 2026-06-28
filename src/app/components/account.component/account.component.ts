import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService, CurrentUser } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ]
})
export class AccountComponent implements OnInit {
  private readonly authService = inject(AuthService);

  currentUser?: CurrentUser;
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';
  hideCurrentPassword = true;
  hideNewPassword = true;

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
  });

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: user => {
        this.currentUser = user;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os dados da conta.';
        this.loading = false;
      }
    });
  }

  toggleVisibility(field: 'current' | 'new'): void {
    if (field === 'current') {
      this.hideCurrentPassword = !this.hideCurrentPassword;
      return;
    }
    this.hideNewPassword = !this.hideNewPassword;
  }

  changePassword(): void {
    this.passwordForm.markAllAsTouched();
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      return;
    }

    const currentPassword = this.passwordForm.value.currentPassword;
    const newPassword = this.passwordForm.value.newPassword;

    if (!currentPassword || !newPassword) {
      return;
    }

    this.saving = true;
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Senha alterada com sucesso.';
        this.passwordForm.reset();
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Senha atual inválida ou não foi possível alterar a senha.';
      }
    });
  }
}
