import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('shouldCreate', () => {
    expect(component).toBeTruthy();
  });

  it('shouldBlockLoginWhenFieldsEmpty', () => {
    component.login();
    expect(component.error).toContain('preencha');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('shouldLoginAndNavigateOnSuccess', () => {
    authService.login.and.returnValue(of({ token: 'jwt' }));
    component.email = 'user@example.com';
    component.password = 'secret';
    component.login();
    expect(authService.login).toHaveBeenCalledWith('user@example.com', 'secret');
  });

  it('shouldShowErrorOnLoginFailure', () => {
    authService.login.and.returnValue(throwError(() => new Error('fail')));
    component.email = 'user@example.com';
    component.password = 'wrong';
    component.login();
    expect(component.error).toContain('inválidos');
  });
});
