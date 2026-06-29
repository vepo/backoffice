import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EngageService } from './engage.service';

describe('EngageService', () => {
  let service: EngageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(EngageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  const channel = { id: 1, youtubeId: 'UC1234567890123456789012', connected: true, apiKeyConfigured: true };
  const video = { id: 1, youtubeId: 'vid1', title: 'Video', commentCount: 0 };
  const videoPage = { items: [video], total: 1, page: 0, pageSize: 20 };
  const comment = { id: 1, youtubeCommentId: 'c1', videoId: 1 };

  it('shouldLoadPlatformStatistics', () => {
    service.loadPlatformStatistics().subscribe();
    httpMock.expectOne('/engage/api/statistics').flush({ channels: [], videos: [], fetchedAt: '2026-01-01' });
  });

  it('shouldFindAllChannels', () => {
    service.findAllChannels().subscribe();
    httpMock.expectOne('/engage/api/channels').flush([channel]);
  });

  it('shouldFindChannelById', () => {
    service.findChannelById(1).subscribe();
    httpMock.expectOne('/engage/api/channels/1').flush(channel);
  });

  it('shouldCreateChannel', () => {
    service.createChannel({ youtubeId: channel.youtubeId, connected: false }).subscribe();
    const req = httpMock.expectOne('/engage/api/channels');
    expect(req.request.method).toBe('POST');
    req.flush(channel);
  });

  it('shouldUpdateChannel', () => {
    service.updateChannel(1, { connected: true }).subscribe();
    httpMock.expectOne('/engage/api/channels/1').flush(channel);
  });

  it('shouldDeleteChannel', () => {
    service.deleteChannel(1).subscribe();
    httpMock.expectOne('/engage/api/channels/1').flush(null);
  });

  it('shouldFindVideosPage', () => {
    service.findVideosPage(0, 20, 'query').subscribe();
    const req = httpMock.expectOne(r =>
      r.url === '/engage/api/videos'
      && r.params.get('page') === '0'
      && r.params.get('size') === '20'
      && r.params.get('q') === 'query');
    expect(req.request.method).toBe('GET');
    req.flush(videoPage);
  });

  it('shouldFindCommentsByVideo', () => {
    service.findCommentsByVideo(1).subscribe();
    httpMock.expectOne('/engage/api/videos/1/comments').flush([comment]);
  });

  it('shouldFindCommentWordCloudByVideo', () => {
    service.findCommentWordCloudByVideo(1).subscribe();
    httpMock.expectOne('/engage/api/videos/1/comments/word-cloud').flush([{ word: 'engage', count: 3 }]);
  });

  it('shouldFindCommentsByChannel', () => {
    service.findCommentsByChannel(1).subscribe();
    httpMock.expectOne('/engage/api/channels/1/comments').flush([comment]);
  });

  it('shouldFindCommentWordCloudByChannel', () => {
    service.findCommentWordCloudByChannel(1).subscribe();
    httpMock.expectOne('/engage/api/channels/1/comments/word-cloud').flush([{ word: 'canal', count: 2 }]);
  });
});
