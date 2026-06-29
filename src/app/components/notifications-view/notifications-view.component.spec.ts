import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NotificationsViewComponent } from './notifications-view.component';
import { createNotificationServiceStub } from '../../testing/notification-service-stub';
import { NotificationService } from '../../services/notification.service';
import { sampleNotificationSummary } from '../../testing/notification-fixtures';

describe('NotificationsViewComponent', () => {
  let component: NotificationsViewComponent;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    notificationService = createNotificationServiceStub();
    notificationService.markRead.and.returnValue(of(sampleNotificationSummary({ read: true })));
    notificationService.markUnread.and.returnValue(of(sampleNotificationSummary({ read: false })));
    notificationService.markAllRead.and.returnValue(of({ markedCount: 1 }));

    await TestBed.configureTestingModule({
      imports: [NotificationsViewComponent],
      providers: [
        provideRouter([]),
        { provide: NotificationService, useValue: notificationService },
        { provide: ActivatedRoute, useValue: { data: of({ notifications: [sampleNotificationSummary()] }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(NotificationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadNotificationsFromResolver', () => {
    expect(component.notifications.length).toBe(1);
  });

  it('shouldMarkNotificationAsRead', () => {
    const notification = sampleNotificationSummary({ read: false });
    component.notifications = [notification];
    component.markRead(notification, new Event('click'));
    expect(notificationService.markRead).toHaveBeenCalledWith(notification.id);
  });

  it('shouldFilterUnreadNotifications', () => {
    component.setReadFilter('unread');
    expect(notificationService.list).toHaveBeenCalledWith(true);
  });

  it('shouldMarkAllNotificationsAsRead', () => {
    component.notifications = [
      sampleNotificationSummary({ read: false }),
      sampleNotificationSummary({ id: 2, read: false })
    ];
    component.markAllRead();
    expect(notificationService.markAllRead).toHaveBeenCalled();
    expect(component.notifications.every(notification => notification.read)).toBeTrue();
  });

  it('shouldLabelVideoSyncSource', () => {
    expect(component.sourceLabel(sampleNotificationSummary({ sourceType: 'video_sync' }))).toBe('Sincronização de vídeos');
  });
});
