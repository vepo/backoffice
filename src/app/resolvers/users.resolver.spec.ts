import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap, RedirectCommand, RouterStateSnapshot } from '@angular/router';
import { userResolver, usersResolver } from './users.resolver';
import { User, UsersService } from '../services/users.service';
import { resolveRouteData } from '../testing/resolver-helpers';

describe('usersResolver', () => {
  let httpMock: HttpTestingController;
  const state = {} as RouterStateSnapshot;
  const user = { id: 1, username: 'u', name: 'U', email: 'u@x.com', profiles: [], disabled: false, createdAt: new Date(), updatedAt: new Date() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UsersService]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldResolveUsersList', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<User[]>(usersResolver({} as never, state))
    );
    httpMock.expectOne(r => r.url.includes('/users/search')).flush([user]);
    const users = await promise;
    expect(users.length).toBe(1);
  });

  it('shouldResolveUserById', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<User>(userResolver({ paramMap: convertToParamMap({ userId: '1' }) } as never, state))
    );
    httpMock.expectOne('/passport/api/users/1').flush(user);
    const resolved = await promise;
    expect(resolved.id).toBe(1);
  });

  it('shouldRedirectWhenUserIdMissing', () => {
    TestBed.runInInjectionContext(() => {
      const result = userResolver({ paramMap: convertToParamMap({}) } as never, state);
      expect(result instanceof RedirectCommand).toBeTrue();
    });
  });
});
