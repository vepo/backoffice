import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Channel, Comment, EngageService, Video } from '../services/engage.service';
import { NotificationService, NotificationSummary } from '../services/notification.service';

export const engageChannelsResolver: ResolveFn<Channel[]> = () => {
  return inject(EngageService).findAllChannels();
};

export const engageChannelResolver: ResolveFn<Channel> = (route) => {
  const channelId = route.paramMap.get('channelId');
  if (!channelId) {
    return new RedirectCommand(inject(Router).parseUrl('/engage/channels'));
  }
  return inject(EngageService).findChannelById(Number(channelId));
};

export const engageVideosResolver: ResolveFn<Video[]> = () => {
  return inject(EngageService).findAllVideos();
};

export const engageVideoCommentsResolver: ResolveFn<Comment[]> = (route) => {
  const videoId = route.paramMap.get('videoId');
  if (!videoId) {
    return new RedirectCommand(inject(Router).parseUrl('/engage/videos'));
  }
  return inject(EngageService).findCommentsByVideo(Number(videoId));
};

export const engageChannelCommentsResolver: ResolveFn<Comment[]> = (route) => {
  const channelId = route.paramMap.get('channelId');
  if (!channelId) {
    return new RedirectCommand(inject(Router).parseUrl('/engage/channels'));
  }
  return inject(EngageService).findCommentsByChannel(Number(channelId));
};

export const engageChannelReportsResolver: ResolveFn<NotificationSummary[]> = (route) => {
  const channelId = route.paramMap.get('channelId');
  if (!channelId) {
    return new RedirectCommand(inject(Router).parseUrl('/engage/channels'));
  }
  return inject(NotificationService).listByChannel(Number(channelId));
};
