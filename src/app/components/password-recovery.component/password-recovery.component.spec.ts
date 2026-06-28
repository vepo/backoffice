import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasswordRecoveryComponent } from './password-recovery.component';
import { AuthService } from '../../services/auth.service';

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent;
  let fixture: ComponentFixture<PasswordRecoveryComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['recovery']);
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('shouldSubmitRecoveryEmail', () => {
    authService.recovery.and.returnValue(of(undefined));
    component.email.setValue('user@example.com');
    component.recovery();
    expect(authService.recovery).toHaveBeenCalledWith('user@example.com');
  });

  it('shouldShowErrorOnRecoveryFailure', () => {
    authService.recovery.and.returnValue(throwError(() => new Error('fail')));
    component.email.setValue('user@example.com');
    component.recovery();
    expect(component.error).toContain('Não foi possível');
  });
});
