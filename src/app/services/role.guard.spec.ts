import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from './auth.service';
import { buildValidJwt } from '../testing/jwt-fixtures';

describe('roleGuard', () => {
  let authService: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), AuthService, { provide: Router, useValue: router }]
    });
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  function runGuard(roles?: string[]): boolean {
    const route = { data: { roles } } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => roleGuard(route, {} as never)) as boolean;
  }

  it('shouldAllowUserWithRequiredRole', () => {
    authService.saveToken(buildValidJwt(['passport.admin']));
    expect(runGuard(['passport.admin'])).toBeTrue();
  });

  it('shouldRedirectHomeWhenRoleMissing', () => {
    authService.saveToken(buildValidJwt(['domains.admin']));
    expect(runGuard(['passport.admin'])).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('shouldPassWhenNoRolesConfigured', () => {
    expect(runGuard(undefined)).toBeTrue();
    expect(runGuard([])).toBeTrue();
  });
});
