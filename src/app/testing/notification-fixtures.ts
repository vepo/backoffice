import {
  ChannelFollow,
  NotificationDetail,
  NotificationItem,
  NotificationSummary
} from '../services/notification.service';

export function sampleNotificationSummary(overrides: Partial<NotificationSummary> = {}): NotificationSummary {
  return {
    id: 1,
    sourceService: 'engage',
    sourceType: 'video_sync',
    engageChannelId: 10,
    title: 'Sync complete',
    description: 'Videos synchronized',
    read: false,
    itemCount: 3,
    createdAt: '2026-06-01T10:00:00Z',
    ...overrides
  };
}

export function sampleNotificationItem(overrides: Partial<NotificationItem> = {}): NotificationItem {
  return {
    id: 1,
    title: 'API call',
    description: 'Fetched videos',
    report: '{}',
    sequence: 1,
    ...overrides
  };
}

export function sampleNotificationDetail(overrides: Partial<NotificationDetail> = {}): NotificationDetail {
  return {
    id: 1,
    sourceService: 'engage',
    sourceType: 'comment_sync',
    engageChannelId: 10,
    title: 'Comment sync',
    description: 'Comments synchronized',
    report: '{"status":"ok"}',
    read: true,
    createdAt: '2026-06-01T10:00:00Z',
    items: [sampleNotificationItem()],
    ...overrides
  };
}

export function sampleChannelFollow(overrides: Partial<ChannelFollow> = {}): ChannelFollow {
  return {
    id: 1,
    engageChannelId: 10,
    createdAt: '2026-06-01T10:00:00Z',
    ...overrides
  };
}
