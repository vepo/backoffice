import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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


    passwordResetForm = new FormGroup({
        recoveryPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        confirmNewPassword: new FormControl('', [Validators.required])
    });
    hideRecovery = signal(true);
    hideNewPassword = signal(true);
    hideConfirmNewPassword = signal(true);


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

    recovery() { }
}