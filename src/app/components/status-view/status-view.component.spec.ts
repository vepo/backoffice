import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { StatusViewComponent } from './status-view.component';
import { PlatformStatusService, MICROSERVICES } from '../../services/platform-status.service';
import { StatsService } from '../../services/stats.service';
import { AuthService } from '../../services/auth.service';

describe('StatusViewComponent', () => {
  let component: StatusViewComponent;
  let platformStatusService: jasmine.SpyObj<PlatformStatusService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    platformStatusService = jasmine.createSpyObj('PlatformStatusService', ['checkAll', 'aggregateStatus']);
    platformStatusService.checkAll.and.returnValue(of(
      MICROSERVICES.map(s => ({ service: s, status: 'UP' as const, checks: [] }))
    ));
    platformStatusService.aggregateStatus.and.returnValue('OPERATIONAL');

    authService = jasmine.createSpyObj('AuthService', ['hasRole', 'hasAnyRole']);
    authService.hasAnyRole.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [StatusViewComponent],
      providers: [
        provideRouter([]),
        { provide: PlatformStatusService, useValue: platformStatusService },
        {
          provide: StatsService,
          useValue: jasmine.createSpyObj('StatsService', ['summary'])
        },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(StatusViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('shouldRefreshPlatformStatus', () => {
    expect(platformStatusService.checkAll).toHaveBeenCalled();
    expect(component.platformStatus).toBe('OPERATIONAL');
  });

  it('shouldShowStatsForDomainsAdmin', () => {
    authService.hasAnyRole.and.returnValue(true);
    const statsService = TestBed.inject(StatsService) as jasmine.SpyObj<StatsService>;
    statsService.summary.and.returnValue(of({
      totalViews: 100, daysInRange: 30, monitoredPages: 5, topDomains: [], topPagesLastWeek: []
    }));
    component.refresh();
    expect(statsService.summary).toHaveBeenCalled();
  });

  it('shouldCountOperationalServices', () => {
    component.services = MICROSERVICES.map(s => ({ service: s, status: 'UP' as const, checks: [] }));
    expect(component.operationalCount()).toBe(MICROSERVICES.length);
  });
});
