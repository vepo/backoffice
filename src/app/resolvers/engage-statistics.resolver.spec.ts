import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterStateSnapshot } from '@angular/router';
import { engageStatisticsResolver } from './engage-statistics.resolver';
import { PlatformStatistics, EngageService } from '../services/engage.service';
import { resolveRouteData } from '../testing/resolver-helpers';

describe('engageStatisticsResolver', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), EngageService]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldResolvePlatformStatistics', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<PlatformStatistics>(engageStatisticsResolver({} as never, {} as RouterStateSnapshot))
    );
    httpMock.expectOne('/engage/api/statistics').flush({ channels: [], videos: [], fetchedAt: '2026-01-01' });
    const stats = await promise;
    expect(stats.fetchedAt).toBe('2026-01-01');
  });
});
