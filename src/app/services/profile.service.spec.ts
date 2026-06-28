import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  const profile = { id: 1, name: 'Admin', roles: [], disabled: false };

  it('shouldGetAllProfiles', () => {
    service.getAllProfiles().subscribe();
    httpMock.expectOne('/passport/api/profiles').flush([profile]);
  });

  it('shouldGetProfileById', () => {
    service.getProfileById(1).subscribe();
    httpMock.expectOne('/passport/api/profiles/1').flush(profile);
  });

  it('shouldCreateProfile', () => {
    service.create({ name: 'Admin', roleIds: [1] }).subscribe();
    const req = httpMock.expectOne('/passport/api/profiles/');
    expect(req.request.method).toBe('POST');
    req.flush(profile);
  });

  it('shouldUpdateProfile', () => {
    service.update(1, { name: 'Admin', roleIds: [1] }).subscribe();
    const req = httpMock.expectOne('/passport/api/profiles/1');
    expect(req.request.method).toBe('PUT');
    req.flush(profile);
  });

  it('shouldSearchProfiles', () => {
    service.search({ name: 'Admin', roles: [], disabled: false }).subscribe();
    httpMock.expectOne(r => r.url === '/passport/api/profiles/search').flush([profile]);
  });

  it('shouldDisableProfile', () => {
    service.disable(1).subscribe();
    httpMock.expectOne('/passport/api/profiles/1/disable').flush({ ...profile, disabled: true });
  });

  it('shouldEnableProfile', () => {
    service.enable(1).subscribe();
    httpMock.expectOne('/passport/api/profiles/1/enable').flush(profile);
  });
});
