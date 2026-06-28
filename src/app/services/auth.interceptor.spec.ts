import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { buildValidJwt } from '../testing/jwt-fixtures';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthService
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('shouldAttachBearerHeaderWhenTokenPresent', () => {
    const token = buildValidJwt();
    authService.saveToken(token);

    http.get('/passport/api/auth/me').subscribe();

    const req = httpMock.expectOne('/passport/api/auth/me');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('shouldNotAttachHeaderWhenLoggedOut', () => {
    http.get('/passport/api/auth/me').subscribe();

    const req = httpMock.expectOne('/passport/api/auth/me');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
