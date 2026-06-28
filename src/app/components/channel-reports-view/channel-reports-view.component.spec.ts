import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChannelReportsViewComponent } from './channel-reports-view.component';
import { NotificationService } from '../../services/notification.service';
import { createNotificationServiceStub } from '../../testing/notification-service-stub';
import { sampleNotificationSummary } from '../../testing/notification-fixtures';

describe('ChannelReportsViewComponent', () => {
  let component: ChannelReportsViewComponent;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const channel = { id: 10, youtubeId: 'UC1234567890123456789012', connected: true, apiKeyConfigured: true };
  const reports = [sampleNotificationSummary(), sampleNotificationSummary({ id: 2, title: 'Other report' })];

  beforeEach(async () => {
    notificationService = createNotificationServiceStub();

    await TestBed.configureTestingModule({
      imports: [ChannelReportsViewComponent],
      providers: [
        provideRouter([]),
        { provide: NotificationService, useValue: notificationService },
        { provide: ActivatedRoute, useValue: { data: of({ channel, reports }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ChannelReportsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadReportsFromResolver', () => {
    expect(component.reports.length).toBe(2);
  });

  it('shouldFilterChannelReportsByText', () => {
    component.textFilter = 'Other';
    component.applyFilters();
    expect(component.filteredReports.length).toBe(1);
  });

  it('shouldLabelVideoSyncSource', () => {
    expect(component.sourceLabel(sampleNotificationSummary())).toBe('Sincronização de vídeos');
  });
});
