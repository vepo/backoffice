import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const CHANNELS_URL = '/engage/api/channels';
const VIDEOS_URL = '/engage/api/videos';
const STATISTICS_URL = '/engage/api/statistics';

export interface Channel {
  id: number;
  youtubeId: string;
  connected: boolean;
  apiKeyConfigured: boolean;
  nextPageToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
  syncAt?: string;
}

export interface CreateChannelPayload {
  youtubeId: string;
  youtubeApiKey?: string | null;
  connected: boolean;
}

export interface UpdateChannelPayload {
  youtubeId?: string | null;
  youtubeApiKey?: string | null;
  connected?: boolean | null;
}

export interface Video {
  id: number;
  youtubeId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
}

export interface Comment {
  id: number;
  youtubeCommentId: string;
  videoId: number;
  authorName?: string;
  authorChannelId?: string;
  text?: string;
  likeCount?: number;
  publishedAt?: string;
  updatedAt?: string;
  syncAt?: string;
}

export interface ChannelStatistics {
  id: number;
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  hiddenSubscriberCount: boolean;
  lastSyncAt?: string;
}

export interface VideoStatistics {
  id: number;
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string;
}

export interface PlatformStatistics {
  channels: ChannelStatistics[];
  videos: VideoStatistics[];
  fetchedAt: string;
}

@Injectable({ providedIn: 'root' })
export class EngageService {
  private readonly http = inject(HttpClient);

  loadPlatformStatistics(): Observable<PlatformStatistics> {
    return this.http.get<PlatformStatistics>(STATISTICS_URL);
  }

  findAllChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(CHANNELS_URL);
  }

  findChannelById(id: number): Observable<Channel> {
    return this.http.get<Channel>(`${CHANNELS_URL}/${id}`);
  }

  createChannel(payload: CreateChannelPayload): Observable<Channel> {
    return this.http.post<Channel>(CHANNELS_URL, payload);
  }

  updateChannel(id: number, payload: UpdateChannelPayload): Observable<Channel> {
    return this.http.put<Channel>(`${CHANNELS_URL}/${id}`, payload);
  }

  deleteChannel(id: number): Observable<void> {
    return this.http.delete<void>(`${CHANNELS_URL}/${id}`);
  }

  findAllVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(VIDEOS_URL);
  }

  findCommentsByVideo(videoId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${VIDEOS_URL}/${videoId}/comments`);
  }

  findCommentsByChannel(channelId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${CHANNELS_URL}/${channelId}/comments`);
  }
}
