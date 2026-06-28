import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap, RedirectCommand, RouterStateSnapshot } from '@angular/router';
import { notificationResolver, notificationsResolver } from './notifications.resolver';
import { NotificationDetail, NotificationService, NotificationSummary } from '../services/notification.service';
import { sampleNotificationDetail, sampleNotificationSummary } from '../testing/notification-fixtures';
import { resolveRouteData } from '../testing/resolver-helpers';

describe('notificationsResolver', () => {
  let httpMock: HttpTestingController;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), NotificationService]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldResolveNotificationsList', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<NotificationSummary[]>(notificationsResolver({} as never, state))
    );
    httpMock.expectOne('/passport/api/notifications').flush([sampleNotificationSummary()]);
    const list = await promise;
    expect(list.length).toBe(1);
  });

  it('shouldResolveNotificationById', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<NotificationDetail>(notificationResolver({ paramMap: convertToParamMap({ notificationId: '1' }) } as never, state))
    );
    httpMock.expectOne('/passport/api/notifications/1').flush(sampleNotificationDetail());
    const resolved = await promise;
    expect(resolved.id).toBe(1);
  });

  it('shouldRedirectWhenNotificationIdMissing', () => {
    TestBed.runInInjectionContext(() => {
      const result = notificationResolver({ paramMap: convertToParamMap({}) } as never, state);
      expect(result instanceof RedirectCommand).toBeTrue();
    });
  });
});
