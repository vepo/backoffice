import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../services/auth.service';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['resetPassword', 'isAuthenticated']);
    authService.isAuthenticated.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { token: 'reset-token' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('shouldRedirectWhenAlreadyLoggedIn', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/']);
  });

  it('shouldRejectMismatchedPasswords', () => {
    component.passwordResetForm.patchValue({
      recoveryPassword: 'Temp123!',
      newPassword: 'NewPass1!',
      confirmNewPassword: 'OtherPass1!'
    });
    expect(component.passwordResetForm.valid).toBeFalse();
  });

  it('shouldCallResetPasswordWhenFormValid', () => {
    authService.resetPassword.and.returnValue(of({ token: 'jwt' }));
    component.passwordResetForm.patchValue({
      recoveryPassword: 'Temp123!',
      newPassword: 'NewPass1!',
      confirmNewPassword: 'NewPass1!'
    });
    component.recovery();
    expect(authService.resetPassword).toHaveBeenCalledWith('reset-token', 'Temp123!', 'NewPass1!');
  });
});
