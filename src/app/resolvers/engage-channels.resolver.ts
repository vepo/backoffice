import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Channel, Comment, EngageService, WordCloudEntry } from '../services/engage.service';
import { NotificationService, NotificationSummary } from '../services/notification.service';

export const engageChannelsResolver: ResolveFn<Channel[]> = () => {
  return inject(EngageService).findAllChannels();
};

export const engageChannelResolver: ResolveFn<Channel> = (route) => {
  const channelId = route.paramMap.get('channelId');
  if (!channelId) {
    return new RedirectCommand(inject(Router).parseUrl('/channels'));
  }
  return inject(EngageService).findChannelById(Number(channelId));
};

export const engageVideoCommentsResolver: ResolveFn<Comment[]> = (route) => {
  const videoId = route.paramMap.get('videoId');
  if (!videoId) {
    return new RedirectCommand(inject(Router).parseUrl('/videos'));
  }
  return inject(EngageService).findCommentsByVideo(Number(videoId));
};

export const engageVideoCommentWordCloudResolver: ResolveFn<WordCloudEntry[]> = (route) => {
  const videoId = route.paramMap.get('videoId');
  if (!videoId) {
    return new RedirectCommand(inject(Router).parseUrl('/videos'));
  }
  return inject(EngageService).findCommentWordCloudByVideo(Number(videoId));
};

export const engageChannelCommentsResolver: ResolveFn<Comment[]> = (route) => {
  const channelId = route.paramMap.get('channelId');
  if (!channelId) {
    return new RedirectCommand(inject(Router).parseUrl('/channels'));
  }
  return inject(EngageService).findCommentsByChannel(Number(channelId));
};

export const engageChannelCommentWordCloudResolver: ResolveFn<WordCloudEntry[]> = (route) => {
  const channelId = route.paramMap.get('channelId');
  if (!channelId) {
    return new RedirectCommand(inject(Router).parseUrl('/channels'));
  }
  return inject(EngageService).findCommentWordCloudByChannel(Number(channelId));
};

export const engageChannelReportsResolver: ResolveFn<NotificationSummary[]> = (route) => {
  const channelId = route.paramMap.get('channelId');
  if (!channelId) {
    return new RedirectCommand(inject(Router).parseUrl('/channels'));
  }
  return inject(NotificationService).listByChannel(Number(channelId));
};
