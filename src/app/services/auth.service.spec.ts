import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { buildValidJwt } from '../testing/jwt-fixtures';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('shouldStoreJwtOnLogin', () => {
    const token = buildValidJwt(['passport.admin']);

    service.login('user@example.com', 'secret').subscribe(response => {
      expect(response.token).toBe(token);
    });

    const req = httpMock.expectOne('/passport/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@example.com', password: 'secret' });
    req.flush({ token });

    expect(service.getToken()).toBe(token);
  });

  it('shouldClearTokenOnLogout', () => {
    service.saveToken(buildValidJwt());
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('shouldReturnRolesFromGroupsClaim', () => {
    service.saveToken(buildValidJwt(['passport.admin', 'domains.admin']));
    expect(service.getRoles()).toEqual(['passport.admin', 'domains.admin']);
    expect(service.hasRole('passport.admin')).toBeTrue();
    expect(service.hasRole('engage.admin')).toBeFalse();
  });

  it('shouldCallChangePasswordEndpoint', () => {
    service.changePassword('old', 'new').subscribe();

    const req = httpMock.expectOne('/passport/api/auth/change-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ currentPassword: 'old', newPassword: 'new' });
    req.flush(null);
  });

  it('shouldDetectAuthenticatedUserFromValidToken', () => {
    service.saveToken(buildValidJwt());
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
  });
});
