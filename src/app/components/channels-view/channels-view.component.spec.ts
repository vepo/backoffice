import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChannelsViewComponent } from './channels-view.component';
import { EngageService } from '../../services/engage.service';
import { createMatDialogSpy } from '../../testing/material-stubs';
import { createNotificationServiceStub } from '../../testing/notification-service-stub';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';

describe('ChannelsViewComponent', () => {
  let component: ChannelsViewComponent;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const channel = { id: 10, youtubeId: 'UC1234567890123456789012', connected: true, apiKeyConfigured: true };

  beforeEach(async () => {
    notificationService = createNotificationServiceStub();

    await TestBed.configureTestingModule({
      imports: [ChannelsViewComponent],
      providers: [
        provideRouter([]),
        { provide: EngageService, useValue: jasmine.createSpyObj('EngageService', ['deleteChannel']) },
        { provide: NotificationService, useValue: notificationService },
        { provide: MatDialog, useValue: createMatDialogSpy() },
        { provide: ActivatedRoute, useValue: { data: of({ channels: [channel] }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ChannelsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadChannelsFromResolver', () => {
    expect(component.channels.length).toBe(1);
  });

  it('shouldFollowChannelFromChannelsList', () => {
    component.toggleFollow(channel);
    expect(notificationService.followChannel).toHaveBeenCalledWith(10);
  });

  it('shouldUnfollowChannelWhenAlreadyFollowing', () => {
    component.followedChannelIds.add(10);
    component.toggleFollow(channel);
    expect(notificationService.unfollowChannel).toHaveBeenCalledWith(10);
  });
});
