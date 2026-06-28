import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap, RedirectCommand, RouterStateSnapshot } from '@angular/router';
import { profileResolver, profilesResolver } from './profiles.resolver';
import { Profile, ProfileService } from '../services/profile.service';
import { resolveRouteData } from '../testing/resolver-helpers';

describe('profilesResolver', () => {
  let httpMock: HttpTestingController;
  const state = {} as RouterStateSnapshot;
  const profile = { id: 1, name: 'Admin', roles: [], disabled: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProfileService]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldResolveProfilesList', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Profile[]>(profilesResolver({} as never, state))
    );
    httpMock.expectOne('/passport/api/profiles').flush([profile]);
    const list = await promise;
    expect(list.length).toBe(1);
  });

  it('shouldResolveProfileById', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Profile>(profileResolver({ paramMap: convertToParamMap({ profileId: '1' }) } as never, state))
    );
    httpMock.expectOne('/passport/api/profiles/1').flush(profile);
    const resolved = await promise;
    expect(resolved.id).toBe(1);
  });

  it('shouldRedirectWhenProfileIdMissing', () => {
    TestBed.runInInjectionContext(() => {
      const result = profileResolver({ paramMap: convertToParamMap({}) } as never, state);
      expect(result instanceof RedirectCommand).toBeTrue();
    });
  });
});
