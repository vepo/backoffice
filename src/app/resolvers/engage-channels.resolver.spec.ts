import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap, RedirectCommand, RouterStateSnapshot } from '@angular/router';
import {
  engageChannelCommentsResolver,
  engageChannelReportsResolver,
  engageChannelResolver,
  engageChannelsResolver,
  engageVideoCommentsResolver
} from './engage-channels.resolver';
import { Channel, Comment, EngageService } from '../services/engage.service';
import { NotificationService, NotificationSummary } from '../services/notification.service';
import { sampleNotificationSummary } from '../testing/notification-fixtures';
import { resolveRouteData } from '../testing/resolver-helpers';

describe('engage-channels resolvers', () => {
  let httpMock: HttpTestingController;
  const state = {} as RouterStateSnapshot;
  const channel = { id: 1, youtubeId: 'UC1234567890123456789012', connected: true, apiKeyConfigured: true };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), EngageService, NotificationService]
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shouldResolveChannels', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Channel[]>(engageChannelsResolver({} as never, state))
    );
    httpMock.expectOne('/engage/api/channels').flush([channel]);
    const list = await promise;
    expect(list.length).toBe(1);
  });

  it('shouldResolveChannelById', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Channel>(engageChannelResolver({ paramMap: convertToParamMap({ channelId: '1' }) } as never, state))
    );
    httpMock.expectOne('/engage/api/channels/1').flush(channel);
    const resolved = await promise;
    expect(resolved.id).toBe(1);
  });

  it('shouldRedirectWhenChannelIdMissing', () => {
    TestBed.runInInjectionContext(() => {
      const result = engageChannelResolver({ paramMap: convertToParamMap({}) } as never, state);
      expect(result instanceof RedirectCommand).toBeTrue();
    });
  });

  it('shouldResolveVideoComments', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Comment[]>(engageVideoCommentsResolver({ paramMap: convertToParamMap({ videoId: '1' }) } as never, state))
    );
    httpMock.expectOne('/engage/api/videos/1/comments').flush([]);
    await promise;
  });

  it('shouldResolveChannelComments', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<Comment[]>(engageChannelCommentsResolver({ paramMap: convertToParamMap({ channelId: '1' }) } as never, state))
    );
    httpMock.expectOne('/engage/api/channels/1/comments').flush([]);
    await promise;
  });

  it('shouldResolveChannelReports', async () => {
    const promise = TestBed.runInInjectionContext(() =>
      resolveRouteData<NotificationSummary[]>(engageChannelReportsResolver({ paramMap: convertToParamMap({ channelId: '10' }) } as never, state))
    );
    httpMock.expectOne('/passport/api/notifications/by-channel/10').flush([sampleNotificationSummary()]);
    const list = await promise;
    expect(list.length).toBe(1);
  });
});
