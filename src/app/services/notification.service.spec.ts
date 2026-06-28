import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { sampleNotificationDetail, sampleNotificationSummary } from '../testing/notification-fixtures';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldListNotifications', () => {
    service.list().subscribe(list => expect(list.length).toBe(1));
    httpMock.expectOne('/passport/api/notifications').flush([sampleNotificationSummary()]);
  });

  it('shouldListUnreadNotifications', () => {
    service.list(true).subscribe();
    const req = httpMock.expectOne(r => r.url === '/passport/api/notifications');
    expect(req.request.params.get('unread')).toBe('true');
    req.flush([]);
  });

  it('shouldListByChannel', () => {
    service.listByChannel(10).subscribe();
    httpMock.expectOne('/passport/api/notifications/by-channel/10').flush([]);
  });

  it('shouldFindNotificationById', (done) => {
    let emitted = false;
    service.unreadCountChanged$.subscribe(() => { emitted = true; });

    service.findById(1).subscribe();
    httpMock.expectOne('/passport/api/notifications/1').flush(sampleNotificationDetail());
    expect(emitted).toBeTrue();
    done();
  });

  it('shouldMarkNotificationAsRead', (done) => {
    let emitted = false;
    service.unreadCountChanged$.subscribe(() => { emitted = true; });

    service.markRead(1).subscribe();
    const req = httpMock.expectOne('/passport/api/notifications/1/read');
    expect(req.request.method).toBe('PATCH');
    req.flush(sampleNotificationSummary({ read: true }));
    expect(emitted).toBeTrue();
    done();
  });

  it('shouldMarkNotificationAsUnread', () => {
    service.markUnread(1).subscribe();
    const req = httpMock.expectOne('/passport/api/notifications/1/unread');
    expect(req.request.method).toBe('PATCH');
    req.flush(sampleNotificationSummary({ read: false }));
  });

  it('shouldGetUnreadCount', () => {
    service.getUnreadCount().subscribe(r => expect(r.count).toBe(3));
    httpMock.expectOne('/passport/api/notifications/unread-count').flush({ count: 3 });
  });

  it('shouldListChannelFollows', () => {
    service.listChannelFollows().subscribe();
    httpMock.expectOne('/passport/api/channel-follows').flush([]);
  });

  it('shouldGetFollowStatus', () => {
    service.getFollowStatus(10).subscribe(s => expect(s.following).toBeTrue());
    httpMock.expectOne('/passport/api/channel-follows/10/status').flush({ following: true });
  });

  it('shouldFollowChannel', () => {
    service.followChannel(10).subscribe();
    const req = httpMock.expectOne('/passport/api/channel-follows');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ engageChannelId: 10 });
    req.flush(null);
  });

  it('shouldUnfollowChannel', () => {
    service.unfollowChannel(10).subscribe();
    httpMock.expectOne('/passport/api/channel-follows/10').flush(null);
  });
});
