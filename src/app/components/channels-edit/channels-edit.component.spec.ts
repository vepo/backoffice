import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ChannelsEditComponent } from './channels-edit.component';
import { EngageService } from '../../services/engage.service';
import { createNotificationServiceStub } from '../../testing/notification-service-stub';
import { NotificationService } from '../../services/notification.service';

describe('ChannelsEditComponent', () => {
  let component: ChannelsEditComponent;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    notificationService = createNotificationServiceStub();
    notificationService.getFollowStatus.and.returnValue(of({ following: true }));

    await TestBed.configureTestingModule({
      imports: [ChannelsEditComponent],
      providers: [
        provideRouter([]),
        { provide: EngageService, useValue: jasmine.createSpyObj('EngageService', ['create', 'update']) },
        { provide: NotificationService, useValue: notificationService },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              channel: { id: 10, youtubeId: 'UC1234567890123456789012', connected: true, apiKeyConfigured: true }
            })
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ChannelsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadFollowStatusOnEdit', () => {
    expect(notificationService.getFollowStatus).toHaveBeenCalledWith(10);
    expect(component.receiveNotifications).toBeTrue();
  });

  it('shouldFollowChannelOnReceiveNotificationsChange', () => {
    component.onReceiveNotificationsChange(true);
    expect(notificationService.followChannel).toHaveBeenCalledWith(10);
  });

  it('shouldRollbackFollowOnError', () => {
    notificationService.unfollowChannel.and.returnValue(throwError(() => new Error('fail')));
    component.receiveNotifications = true;
    component.onReceiveNotificationsChange(false);
    expect(component.receiveNotifications).toBeTrue();
  });
});
