import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';

describe('App', () => {
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let authService: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', ['navigate']);
    authService = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn']);
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#start-link')?.textContent).toContain('Início');
  });
});
