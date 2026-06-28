import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EngageStatisticsViewComponent } from './engage-statistics-view.component';
import { EngageService } from '../../services/engage.service';

describe('EngageStatisticsViewComponent', () => {
  let component: EngageStatisticsViewComponent;
  let engageService: jasmine.SpyObj<EngageService>;

  beforeEach(async () => {
    engageService = jasmine.createSpyObj('EngageService', ['loadPlatformStatistics']);
    engageService.loadPlatformStatistics.and.returnValue(of({ channels: [], videos: [], fetchedAt: '2026-01-01' }));

    await TestBed.configureTestingModule({
      imports: [EngageStatisticsViewComponent],
      providers: [
        provideRouter([]),
        { provide: EngageService, useValue: engageService },
        { provide: ActivatedRoute, useValue: { data: of({ statistics: { channels: [], videos: [], fetchedAt: '2026-01-01' } }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(EngageStatisticsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadStatisticsFromResolver', () => {
    expect(component.statistics?.fetchedAt).toBe('2026-01-01');
  });

  it('shouldRefreshStatistics', () => {
    component.refresh();
    expect(engageService.loadPlatformStatistics).toHaveBeenCalled();
  });
});
