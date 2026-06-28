import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(StatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  const summary = {
    totalViews: 100,
    daysInRange: 30,
    monitoredPages: 5,
    topDomains: [],
    topPagesLastWeek: []
  };

  it('shouldFetchSummaryWithDefaultRange', () => {
    service.summary().subscribe(result => expect(result.totalViews).toBe(100));
    const req = httpMock.expectOne(r => r.url === '/visita/api/stats/summary');
    expect(req.request.params.has('startDate')).toBeTrue();
    expect(req.request.params.has('endDate')).toBeTrue();
    req.flush(summary);
  });

  it('shouldFetchSummaryWithCustomRange', () => {
    service.summary({ startDate: '2026-01-01', endDate: '2026-01-31' }).subscribe();
    const req = httpMock.expectOne(r => r.url === '/visita/api/stats/summary');
    expect(req.request.params.get('startDate')).toBe('2026-01-01');
    expect(req.request.params.get('endDate')).toBe('2026-01-31');
    req.flush(summary);
  });
});
