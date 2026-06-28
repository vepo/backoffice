import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Channel } from '../../services/engage.service';
import { NotificationService, NotificationSummary } from '../../services/notification.service';

@Component({
  selector: 'app-channel-reports-view',
  imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule, DatePipe],
  templateUrl: './channel-reports-view.component.html'
})
export class ChannelReportsViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  channel: Channel | null = null;
  reports: NotificationSummary[] = [];
  filteredReports: NotificationSummary[] = [];
  textFilter = '';
  loading = false;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ channel, reports }) => {
      this.channel = channel;
      this.reports = reports;
      this.applyFilters();
    });
  }

  refresh(): void {
    if (!this.channel) {
      return;
    }
    this.loading = true;
    this.notificationService.listByChannel(this.channel.id).subscribe({
      next: reports => {
        this.reports = reports;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const query = this.textFilter.trim().toLowerCase();
    this.filteredReports = this.reports.filter(report =>
      !query ||
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      this.sourceLabel(report).toLowerCase().includes(query)
    );
  }

  clearFilters(): void {
    this.textFilter = '';
    this.applyFilters();
  }

  sourceLabel(report: NotificationSummary): string {
    if (report.sourceType === 'video_sync') {
      return 'Sincronização de vídeos';
    }
    if (report.sourceType === 'comment_sync') {
      return 'Sincronização de comentários';
    }
    return report.sourceType;
  }
}
