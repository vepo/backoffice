import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap, RedirectCommand, RouterStateSnapshot } from '@angular/router';
import { roleResolver, rolesResolver } from './roles.resolver';
import { Role, RoleService } from '../services/roles.service';
import { resolveRouteData } from '../testing/resolver-helpers';

describe('rolesResolver', () => {
  let httpMock: HttpTestingController;
  const state = {} as RouterStateSnapshot;
  const role = { id: 1, name: 'passport.admin' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), RoleService]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldResolveRolesList', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Role[]>(rolesResolver({} as never, state))
    );
    httpMock.expectOne('/passport/api/roles').flush([role]);
    const list = await promise;
    expect(list.length).toBe(1);
  });

  it('shouldResolveRoleById', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Role>(roleResolver({ paramMap: convertToParamMap({ roleId: '1' }) } as never, state))
    );
    httpMock.expectOne('/passport/api/roles/1').flush(role);
    const resolved = await promise;
    expect(resolved.name).toBe('passport.admin');
  });

  it('shouldRedirectWhenRoleIdMissing', () => {
    TestBed.runInInjectionContext(() => {
      const result = roleResolver({ paramMap: convertToParamMap({}) } as never, state);
      expect(result instanceof RedirectCommand).toBeTrue();
    });
  });
});
