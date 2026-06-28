import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  ChannelStatistics,
  EngageService,
  PlatformStatistics,
  VideoStatistics
} from '../../services/engage.service';

@Component({
  selector: 'app-engage-statistics-view',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './engage-statistics-view.component.html'
})
export class EngageStatisticsViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly engageService = inject(EngageService);

  statistics?: PlatformStatistics;
  loading = false;
  error = '';

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statistics }) => {
      this.statistics = statistics;
    });
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.engageService.loadPlatformStatistics().subscribe({
      next: statistics => {
        this.statistics = statistics;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar as estatísticas do YouTube. Verifique a API key e o serviço Engage.';
        this.loading = false;
      }
    });
  }

  totalChannelViews(): number {
    return this.statistics?.channels.reduce((sum, channel) => sum + channel.viewCount, 0) ?? 0;
  }

  totalVideoViews(): number {
    return this.statistics?.videos.reduce((sum, video) => sum + video.viewCount, 0) ?? 0;
  }

  totalLikes(): number {
    return this.statistics?.videos.reduce((sum, video) => sum + video.likeCount, 0) ?? 0;
  }

  formatSubscribers(channel: ChannelStatistics): string {
    if (channel.hiddenSubscriberCount) {
      return 'Oculto';
    }
    return channel.subscriberCount.toLocaleString('pt-BR');
  }

  trackChannel(_index: number, channel: ChannelStatistics): number {
    return channel.id;
  }

  trackVideo(_index: number, video: VideoStatistics): number {
    return video.id;
  }
}
