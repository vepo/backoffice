import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MICROSERVICES, PlatformStatusService } from './platform-status.service';

describe('PlatformStatusService', () => {
  let service: PlatformStatusService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(PlatformStatusService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldCheckAllServices', () => {
    service.checkAll().subscribe(results => expect(results.length).toBe(MICROSERVICES.length));
    MICROSERVICES.forEach(ms => {
      httpMock.expectOne(ms.healthUrl).flush({ status: 'UP', checks: [] });
    });
  });

  it('shouldAggregateOperationalWhenAllUp', () => {
    const health = MICROSERVICES.map(ms => ({
      service: ms,
      status: 'UP' as const,
      checks: []
    }));
    expect(service.aggregateStatus(health)).toBe('OPERATIONAL');
  });

  it('shouldAggregateDegradedWhenPartialUp', () => {
    const health = [
      { service: MICROSERVICES[0], status: 'UP' as const, checks: [] },
      { service: MICROSERVICES[1], status: 'DOWN' as const, checks: [] },
      { service: MICROSERVICES[2], status: 'UP' as const, checks: [] }
    ];
    expect(service.aggregateStatus(health)).toBe('DEGRADED');
  });

  it('shouldAggregateOutageWhenAllDown', () => {
    const health = MICROSERVICES.map(ms => ({
      service: ms,
      status: 'DOWN' as const,
      checks: []
    }));
    expect(service.aggregateStatus(health)).toBe('OUTAGE');
  });
});
