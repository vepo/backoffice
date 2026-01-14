import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-password-recovery',
    templateUrl: './password-recovery.component.html',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink]
})
export class PasswordRecoveryComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    email = new FormControl('', [Validators.required, Validators.email]);
    error = '';
    emailFocused = signal(false);
    formSubmitted = signal(false);

    onEmailFocus() {
        this.emailFocused.set(true);
    }

    onEmailBlur() {
        this.emailFocused.set(false);
    }

    showEmailErrors(): boolean {
        return !this.emailFocused() && this.email.invalid && (this.email.dirty || this.formSubmitted());
    }

    recovery() {
        console.log('yeah');
        this.formSubmitted.set(true);

        if (!this.email.value) {
            this.error = 'Por favor, preencha todos os campos';
            return;
        }

        this.auth.recovery(this.email.value).subscribe({
            next: async () => await this.router.navigate(['/login']),
            error: () => this.error = 'Não foi possível realizar a operação!'
        });
    }
}