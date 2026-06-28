import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap, RedirectCommand, RouterStateSnapshot } from '@angular/router';
import { domainResolver, domainsResolver } from './domains.resolver';
import { DomainService } from '../services/domain.service';
import { Domain } from '../services/domain.service';
import { resolveRouteData } from '../testing/resolver-helpers';

describe('domainsResolver', () => {
  let httpMock: HttpTestingController;
  const state = {} as RouterStateSnapshot;
  const domain = { id: 1, hostname: 'example.com', token: 'tok' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), DomainService]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldResolveDomainsList', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Domain[]>(domainsResolver({} as never, state))
    );
    httpMock.expectOne('/visita/api/domains').flush([domain]);
    const list = await promise;
    expect(list.length).toBe(1);
  });

  it('shouldResolveDomainById', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Domain>(domainResolver({ paramMap: convertToParamMap({ domainId: '1' }) } as never, state))
    );
    httpMock.expectOne('/visita/api/domains/1').flush(domain);
    const resolved = await promise;
    expect(resolved.hostname).toBe('example.com');
  });

  it('shouldRedirectWhenDomainIdMissing', () => {
    TestBed.runInInjectionContext(() => {
      const result = domainResolver({ paramMap: convertToParamMap({}) } as never, state);
      expect(result instanceof RedirectCommand).toBeTrue();
    });
  });
});
