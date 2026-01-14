import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink]
})
export class PasswordResetComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    // Password requirements pattern
    private readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    passwordResetForm = new FormGroup({
        recoveryPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.passwordPattern)
        ]),
        confirmNewPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });

    hideRecovery = signal(true);
    hideNewPassword = signal(true);
    hideConfirmNewPassword = signal(true);

    // Custom validator to check if passwords match
    passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmNewPassword')?.value;

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            form.get('confirmNewPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            form.get('confirmNewPassword')?.setErrors(null);
            return null;
        }
    }

    toggleVisibility(event: MouseEvent, type: string) {
        switch (type) {
            case 'recovery':
                this.hideRecovery.set(!this.hideRecovery());
                event.stopPropagation();
                break;
            case 'new-password':
                this.hideNewPassword.set(!this.hideNewPassword());
                event.stopPropagation();
                break;
            case 'confirm-new-password':
                this.hideConfirmNewPassword.set(!this.hideConfirmNewPassword());
                event.stopPropagation();
                break;
        }
    }

    // Getter methods for easier access in template
    get recoveryPassword() {
        return this.passwordResetForm.get('recoveryPassword');
    }

    get newPassword() {
        return this.passwordResetForm.get('newPassword');
    }

    get confirmNewPassword() {
        return this.passwordResetForm.get('confirmNewPassword');
    }

    recovery() {
        if (this.passwordResetForm.valid) {
            // Call your auth service here
            console.log('Form submitted:', this.passwordResetForm.value);
            // Example:
            // this.auth.resetPassword(
            //     this.recoveryPassword?.value,
            //     this.newPassword?.value
            // ).subscribe({
            //     next: () => this.router.navigate(['/login']),
            //     error: (err) => console.error('Reset failed:', err)
            // });
        }
    }
}