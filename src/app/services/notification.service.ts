import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

export interface NotificationSummary {
  id: number;
  sourceService: string;
  sourceType: string;
  engageChannelId: number | null;
  title: string;
  description: string;
  read: boolean;
  itemCount: number;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  report: string;
  sequence: number;
}

export interface NotificationDetail {
  id: number;
  sourceService: string;
  sourceType: string;
  engageChannelId: number | null;
  title: string;
  description: string;
  report: string;
  read: boolean;
  createdAt: string;
  items: NotificationItem[];
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  markedCount: number;
}

export interface ChannelFollowStatus {
  following: boolean;
}

export interface ChannelFollow {
  id: number;
  engageChannelId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/passport/api';

  private readonly unreadCountChangedSubject = new Subject<void>();
  readonly unreadCountChanged$ = this.unreadCountChangedSubject.asObservable();

  list(unreadOnly = false): Observable<NotificationSummary[]> {
    let params = new HttpParams();
    if (unreadOnly) {
      params = params.set('unread', 'true');
    }
    return this.http.get<NotificationSummary[]>(`${this.apiUrl}/notifications`, { params });
  }

  listByChannel(engageChannelId: number): Observable<NotificationSummary[]> {
    return this.http.get<NotificationSummary[]>(`${this.apiUrl}/notifications/by-channel/${engageChannelId}`);
  }

  listChannelFollows(): Observable<ChannelFollow[]> {
    return this.http.get<ChannelFollow[]>(`${this.apiUrl}/channel-follows`);
  }

  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(`${this.apiUrl}/notifications/unread-count`);
  }

  findById(notificationId: number): Observable<NotificationDetail> {
    return this.http.get<NotificationDetail>(`${this.apiUrl}/notifications/${notificationId}`).pipe(
      tap(() => this.notifyUnreadCountChanged())
    );
  }

  markRead(notificationId: number): Observable<NotificationSummary> {
    return this.http.patch<NotificationSummary>(`${this.apiUrl}/notifications/${notificationId}/read`, {}).pipe(
      tap(() => this.notifyUnreadCountChanged())
    );
  }

  markUnread(notificationId: number): Observable<NotificationSummary> {
    return this.http.patch<NotificationSummary>(`${this.apiUrl}/notifications/${notificationId}/unread`, {}).pipe(
      tap(() => this.notifyUnreadCountChanged())
    );
  }

  markAllRead(): Observable<MarkAllReadResponse> {
    return this.http.patch<MarkAllReadResponse>(`${this.apiUrl}/notifications/read-all`, {}).pipe(
      tap(() => this.notifyUnreadCountChanged())
    );
  }

  getFollowStatus(engageChannelId: number): Observable<ChannelFollowStatus> {
    return this.http.get<ChannelFollowStatus>(`${this.apiUrl}/channel-follows/${engageChannelId}/status`);
  }

  followChannel(engageChannelId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/channel-follows`, { engageChannelId });
  }

  unfollowChannel(engageChannelId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/channel-follows/${engageChannelId}`);
  }

  notifyUnreadCountChanged(): void {
    this.unreadCountChangedSubject.next();
  }
}
