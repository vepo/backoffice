import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DomainService } from './domain.service';

describe('DomainService', () => {
  let service: DomainService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(DomainService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  const domain = { id: 1, hostname: 'example.com', token: 'tok' };

  it('shouldFindAllDomains', () => {
    service.findAll().subscribe();
    httpMock.expectOne('/visita/api/domains').flush([domain]);
  });

  it('shouldSearchDomains', () => {
    service.search({ hostname: 'ex', disabled: false }).subscribe();
    httpMock.expectOne(r => r.url === '/visita/api/domains/search').flush([domain]);
  });

  it('shouldFindDomainById', () => {
    service.findById(1).subscribe();
    httpMock.expectOne('/visita/api/domains/1').flush(domain);
  });

  it('shouldCreateDomain', () => {
    service.create({ hostname: 'new.com' }).subscribe();
    const req = httpMock.expectOne('/visita/api/domains');
    expect(req.request.method).toBe('POST');
    req.flush(domain);
  });

  it('shouldUpdateDomain', () => {
    service.update(1, { hostname: 'updated.com' }).subscribe();
    httpMock.expectOne('/visita/api/domains/1').flush(domain);
  });

  it('shouldDisableDomainWithPatch', () => {
    service.disable(1).subscribe();
    const req = httpMock.expectOne('/visita/api/domains/1/disable');
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...domain, disabled: true });
  });

  it('shouldEnableDomainWithPatch', () => {
    service.enable(1).subscribe();
    const req = httpMock.expectOne('/visita/api/domains/1/enable');
    expect(req.request.method).toBe('PATCH');
    req.flush(domain);
  });

  it('shouldRegenerateDomainToken', () => {
    service.regenerateToken(1).subscribe();
    const req = httpMock.expectOne('/visita/api/domains/1/regenerate-token');
    expect(req.request.method).toBe('POST');
    req.flush({ ...domain, token: 'new-tok' });
  });
});
