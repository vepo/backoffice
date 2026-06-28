import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationDetail, NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications-detail',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './notifications-detail.component.html'
})
export class NotificationsDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  notification: NotificationDetail | null = null;
  actionError = '';

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notification }) => {
      this.notification = notification;
    });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('pt-BR');
  }

  formatReport(report: string): string {
    if (!report) {
      return '';
    }
    try {
      return JSON.stringify(JSON.parse(report), null, 2);
    } catch {
      return report;
    }
  }

  sourceLabel(): string {
    if (!this.notification) {
      return '';
    }
    if (this.notification.sourceType === 'video_sync') {
      return 'Sincronização de vídeos';
    }
    if (this.notification.sourceType === 'comment_sync') {
      return 'Sincronização de comentários';
    }
    return this.notification.sourceType;
  }

  markUnread(): void {
    if (!this.notification) {
      return;
    }
    this.actionError = '';
    this.notificationService.markUnread(this.notification.id).subscribe({
      next: updated => {
        if (this.notification) {
          this.notification = { ...this.notification, read: updated.read };
        }
      },
      error: () => {
        this.actionError = 'Não foi possível marcar como não lida.';
      }
    });
  }

  markRead(): void {
    if (!this.notification || this.notification.read) {
      return;
    }
    this.actionError = '';
    this.notificationService.markRead(this.notification.id).subscribe({
      next: updated => {
        if (this.notification) {
          this.notification = { ...this.notification, read: updated.read };
        }
      },
      error: () => {
        this.actionError = 'Não foi possível marcar como lida.';
      }
    });
  }

  backToList(): void {
    this.router.navigate(['/notifications']);
  }
}
