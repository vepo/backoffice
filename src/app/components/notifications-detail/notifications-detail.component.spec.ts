import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NotificationsDetailComponent } from './notifications-detail.component';
import { createNotificationServiceStub } from '../../testing/notification-service-stub';
import { NotificationService } from '../../services/notification.service';
import { sampleNotificationDetail, sampleNotificationSummary } from '../../testing/notification-fixtures';

describe('NotificationsDetailComponent', () => {
  let component: NotificationsDetailComponent;
  let notificationService: ReturnType<typeof createNotificationServiceStub>;

  beforeEach(async () => {
    notificationService = createNotificationServiceStub();
    notificationService.markRead.and.returnValue(of(sampleNotificationSummary({ read: true })));
    notificationService.markUnread.and.returnValue(of(sampleNotificationSummary({ read: false })));

    await TestBed.configureTestingModule({
      imports: [NotificationsDetailComponent],
      providers: [
        provideRouter([]),
        { provide: NotificationService, useValue: notificationService },
        { provide: ActivatedRoute, useValue: { data: of({ notification: sampleNotificationDetail() }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(NotificationsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadNotificationFromResolver', () => {
    expect(component.notification?.id).toBe(1);
  });

  it('shouldPrettyPrintJsonReport', () => {
    const formatted = component.formatReport('{"status":"ok"}');
    expect(formatted).toContain('"status"');
    expect(formatted).toContain('ok');
  });

  it('shouldMarkNotificationAsUnread', () => {
    component.markUnread();
    expect(notificationService.markUnread).toHaveBeenCalledWith(1);
  });

  it('shouldShowErrorWhenMarkUnreadFails', () => {
    notificationService.markUnread.and.returnValue(throwError(() => new Error('fail')));
    component.markUnread();
    expect(component.actionError).toContain('não lida');
  });

  it('shouldNavigateBackToList', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.backToList();
    expect(router.navigate).toHaveBeenCalledWith(['/notifications']);
  });
});
