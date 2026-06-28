import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { NotificationDetail, NotificationService, NotificationSummary } from '../services/notification.service';

export const notificationsResolver: ResolveFn<NotificationSummary[]> = () => {
  return inject(NotificationService).list();
};

export const notificationResolver: ResolveFn<NotificationDetail> = (route) => {
  const notificationId = route.paramMap.get('notificationId');
  if (!notificationId) {
    return new RedirectCommand(inject(Router).parseUrl('/notifications'));
  }
  return inject(NotificationService).findById(Number(notificationId));
};
