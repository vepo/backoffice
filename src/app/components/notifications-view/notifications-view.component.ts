import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotificationService, NotificationSummary } from '../../services/notification.service';

type ReadFilter = 'all' | 'unread';

@Component({
  selector: 'app-notifications-view',
  imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule],
  templateUrl: './notifications-view.component.html'
})
export class NotificationsViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  notifications: NotificationSummary[] = [];
  readFilter: ReadFilter = 'all';
  loading = false;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notifications }) => {
      this.notifications = notifications;
    });
  }

  refresh(): void {
    this.loading = true;
    this.notificationService.list(this.readFilter === 'unread').subscribe({
      next: notifications => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setReadFilter(filter: ReadFilter): void {
    this.readFilter = filter;
    this.refresh();
  }

  markRead(notification: NotificationSummary, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (notification.read) {
      return;
    }
    this.notificationService.markRead(notification.id).subscribe(updated => {
      this.updateLocal(notification.id, updated);
    });
  }

  markUnread(notification: NotificationSummary, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!notification.read) {
      return;
    }
    this.notificationService.markUnread(notification.id).subscribe(updated => {
      this.updateLocal(notification.id, updated);
      if (this.readFilter === 'unread') {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      }
    });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('pt-BR');
  }

  sourceLabel(notification: NotificationSummary): string {
    if (notification.sourceType === 'video_sync') {
      return 'Sincronização de vídeos';
    }
    if (notification.sourceType === 'comment_sync') {
      return 'Sincronização de comentários';
    }
    return notification.sourceType;
  }

  private updateLocal(id: number, updated: NotificationSummary): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], read: updated.read };
    }
  }
}
