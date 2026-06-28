import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AccountComponent } from './account.component';
import { AuthService } from '../../services/auth.service';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'changePassword']);
    authService.getCurrentUser.and.returnValue(of({
      id: 1,
      username: 'cto-boss',
      name: 'CTO',
      email: 'cto@passport.vepo.dev',
      roles: ['passport.admin']
    }));

    await TestBed.configureTestingModule({
      imports: [AccountComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadCurrentUser', () => {
    expect(component.currentUser?.username).toBe('cto-boss');
    expect(component.loading).toBeFalse();
  });

  it('shouldChangePasswordOnValidForm', () => {
    authService.changePassword.and.returnValue(of(undefined));
    component.passwordForm.setValue({ currentPassword: 'old', newPassword: 'newpass12' });
    component.changePassword();
    expect(authService.changePassword).toHaveBeenCalledWith('old', 'newpass12');
    expect(component.successMessage).toContain('sucesso');
  });

  it('shouldShowErrorWhenChangePasswordFails', () => {
    authService.changePassword.and.returnValue(throwError(() => new Error('fail')));
    component.passwordForm.setValue({ currentPassword: 'wrong', newPassword: 'newpass12' });
    component.changePassword();
    expect(component.errorMessage).toContain('inválida');
  });
});
