import { Subject, of } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { sampleNotificationDetail, sampleNotificationSummary } from './notification-fixtures';

const unreadSubjects = new WeakMap<jasmine.SpyObj<NotificationService>, Subject<void>>();

export function createNotificationServiceStub(): jasmine.SpyObj<NotificationService> {
  const unreadCountChangedSubject = new Subject<void>();
  const spy = jasmine.createSpyObj<NotificationService>('NotificationService', [
    'list',
    'listByChannel',
    'listChannelFollows',
    'getUnreadCount',
    'findById',
    'markRead',
    'markUnread',
    'markAllRead',
    'getFollowStatus',
    'followChannel',
    'unfollowChannel',
    'notifyUnreadCountChanged'
  ]);

  spy.list.and.returnValue(of([]));
  spy.listByChannel.and.returnValue(of([]));
  spy.listChannelFollows.and.returnValue(of([]));
  spy.getUnreadCount.and.returnValue(of({ count: 0 }));
  spy.findById.and.returnValue(of(sampleNotificationDetail()));
  spy.markRead.and.returnValue(of(sampleNotificationSummary({ read: true })));
  spy.markUnread.and.returnValue(of(sampleNotificationSummary({ read: false })));
  spy.markAllRead.and.returnValue(of({ markedCount: 0 }));
  spy.getFollowStatus.and.returnValue(of({ following: false }));
  spy.followChannel.and.returnValue(of(undefined));
  spy.unfollowChannel.and.returnValue(of(undefined));
  spy.notifyUnreadCountChanged.and.callFake(() => unreadCountChangedSubject.next());

  unreadSubjects.set(spy, unreadCountChangedSubject);
  Object.defineProperty(spy, 'unreadCountChanged$', {
    get: () => unreadCountChangedSubject.asObservable()
  });

  return spy;
}

export function emitUnreadCountChanged(stub: jasmine.SpyObj<NotificationService>): void {
  unreadSubjects.get(stub)?.next();
}
