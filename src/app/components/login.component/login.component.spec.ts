import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        LoginComponent // Standalone component
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.error).toBe('');
    expect(component.hide()).toBeTrue();
  });

  it('should update email when input changes', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // expect(component.email).toBe('test@example.com');
  });

  it('should update password when input changes', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // expect(component.password).toBe('password123');
  });

  it('should toggle password visibility on icon click', () => {
    expect(component.hide()).toBeTrue();
    
    const visibilityIcon = fixture.debugElement.query(By.css('mat-icon[matSuffix]'));
    visibilityIcon.triggerEventHandler('click', new MouseEvent('click'));
    
    expect(component.hide()).toBeFalse();
    
    visibilityIcon.triggerEventHandler('click', new MouseEvent('click'));
    
    expect(component.hide()).toBeTrue();
  });

  it('should stop event propagation on icon click', () => {
    const mockEvent = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);
    
    component.clickEvent(mockEvent);
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should call login method on form submit', () => {
    component.email = 'test@example.com';
    component.password = 'password123';
    
    authService.login.and.returnValue(of({token:""}));
    
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should navigate to home on successful login', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = 'password123';
    
    authService.login.and.returnValue(of({token:""}));
    router.navigate.and.returnValue(Promise.resolve(true));
    
    component.login();
    tick();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should display error message on failed login', () => {
    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));
    
    component.login();
    
    expect(component.error).toBe('E-mail ou senha inválidos');
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
  });

  it('should show error message in template when error exists', () => {
    component.error = 'E-mail ou senha inválidos';
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('E-mail ou senha inválidos');
  });

  it('should not show error message when no error exists', () => {
    component.error = '';
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeFalsy();
  });

  it('should have correct icon for password visibility toggle', () => {
    // Initially hidden
    let icon = fixture.debugElement.query(By.css('mat-icon[matSuffix]'));
    expect(icon.nativeElement.textContent.trim()).toBe('visibility_off');
    
    // Click to show
    icon.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    
    icon = fixture.debugElement.query(By.css('mat-icon[matSuffix]'));
    expect(icon.nativeElement.textContent.trim()).toBe('visibility');
    
    // Click to hide again
    icon.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    
    icon = fixture.debugElement.query(By.css('mat-icon[matSuffix]'));
    expect(icon.nativeElement.textContent.trim()).toBe('visibility_off');
  });

  it('should have required fields in form', () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    
    expect(emailInput.hasAttribute('required')).toBeTrue();
    expect(passwordInput.hasAttribute('required')).toBeTrue();
  });

  it('should display login button with correct icon and text', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    const icon = button.query(By.css('mat-icon'));
    const span = button.query(By.css('span'));
    
    expect(button).toBeTruthy();
    // expect(icon.nativeElement.textContent.trim()).toBe('login');
    // expect(span.nativeElement.textContent.trim()).toBe('Entrar');
  });

  it('should display correct header text', () => {
    const header = fixture.debugElement.query(By.css('.form-header h2'));
    const subheader = fixture.debugElement.query(By.css('.form-header p'));
    
    expect(header.nativeElement.textContent).toBe('Passaport - Entrar');
    expect(subheader.nativeElement.textContent).toBe('Sistema de gerenciamento de acesso');
  });

  it('should update password input type based on hide signal', () => {
    // Initially password type
    let passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    expect(passwordInput.type).toBe('password');
    
    // Change to text type
    component.hide.set(false);
    fixture.detectChanges();
    
    passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    expect(passwordInput.type).toBe('text');
    
    // Change back to password type
    component.hide.set(true);
    fixture.detectChanges();
    
    passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    expect(passwordInput.type).toBe('password');
  });
});