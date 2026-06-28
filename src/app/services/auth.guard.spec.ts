import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { buildExpiredJwt, buildValidJwt } from '../testing/jwt-fixtures';

describe('authGuard', () => {
  let authService: AuthService;
  let router: jasmine.SpyObj<Router>;
  let jwtHelper: jasmine.SpyObj<JwtHelperService>;

  beforeEach(() => {
    localStorage.clear();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    jwtHelper = jasmine.createSpyObj<JwtHelperService>('JwtHelperService', ['isTokenExpired']);
    (jwtHelper.isTokenExpired as jasmine.Spy).and.returnValue(false);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        AuthService,
        { provide: JwtHelperService, useValue: jwtHelper },
        { provide: Router, useValue: router }
      ]
    });
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('shouldAllowAuthenticatedUser', () => {
    authService.saveToken(buildValidJwt());
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBeTrue();
  });

  it('shouldRedirectLoginWhenNoToken', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('shouldLogoutAndRedirectWhenTokenExpired', () => {
    authService.saveToken(buildExpiredJwt());
    (jwtHelper.isTokenExpired as jasmine.Spy).and.returnValue(true);
    spyOn(authService, 'logout').and.callThrough();

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBeFalse();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
