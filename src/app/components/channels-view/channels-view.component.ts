import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Channel, EngageService } from '../../services/engage.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmDeleteChannelDialog } from '../confirm-delete-channel.dialog/confirm-delete-channel.dialog';

@Component({
  selector: 'app-channels-view',
  imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule, DatePipe],
  templateUrl: './channels-view.component.html'
})
export class ChannelsViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly engageService = inject(EngageService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  channels: Channel[] = [];
  filteredChannels: Channel[] = [];
  followedChannelIds = new Set<number>();
  followLoadingIds = new Set<number>();
  youtubeIdFilter = '';
  connectionFilter: 'all' | 'connected' | 'disconnected' = 'all';

  ngOnInit(): void {
    this.loadFollows();
    this.activatedRoute.data.subscribe(({ channels }) => {
      this.channels = channels;
      this.applyFilters();
    });
  }

  loadFollows(): void {
    this.notificationService.listChannelFollows().subscribe({
      next: follows => {
        this.followedChannelIds = new Set(follows.map(follow => follow.engageChannelId));
      },
      error: () => {
        this.followedChannelIds = new Set();
      }
    });
  }

  isFollowing(channelId: number): boolean {
    return this.followedChannelIds.has(channelId);
  }

  isFollowLoading(channelId: number): boolean {
    return this.followLoadingIds.has(channelId);
  }

  toggleFollow(channel: Channel): void {
    if (this.followLoadingIds.has(channel.id)) {
      return;
    }

    this.followLoadingIds.add(channel.id);
    const following = this.isFollowing(channel.id);
    const request = following
      ? this.notificationService.unfollowChannel(channel.id)
      : this.notificationService.followChannel(channel.id);

    request.subscribe({
      next: () => {
        if (following) {
          this.followedChannelIds.delete(channel.id);
        } else {
          this.followedChannelIds.add(channel.id);
        }
        this.followLoadingIds.delete(channel.id);
        this.notificationService.notifyUnreadCountChanged();
      },
      error: () => {
        this.followLoadingIds.delete(channel.id);
      }
    });
  }

  applyFilters(): void {
    this.filteredChannels = this.channels.filter(channel => {
      const matchesId = !this.youtubeIdFilter ||
        channel.youtubeId.toLowerCase().includes(this.youtubeIdFilter.toLowerCase());
      const matchesConnection =
        this.connectionFilter === 'all' ||
        (this.connectionFilter === 'connected' && channel.connected) ||
        (this.connectionFilter === 'disconnected' && !channel.connected);
      return matchesId && matchesConnection;
    });
  }

  setConnectionFilter(filter: 'all' | 'connected' | 'disconnected'): void {
    this.connectionFilter = filter;
    this.applyFilters();
  }

  clearFilters(): void {
    this.youtubeIdFilter = '';
    this.connectionFilter = 'all';
    this.applyFilters();
  }

  connectedCount(): number {
    return this.channels.filter(channel => channel.connected).length;
  }

  configuredKeyCount(): number {
    return this.channels.filter(channel => channel.apiKeyConfigured).length;
  }

  confirmDelete(channel: Channel): void {
    this.dialog
      .open(ConfirmDeleteChannelDialog, {
        data: { id: channel.id, youtubeId: channel.youtubeId }
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.engageService.deleteChannel(channel.id).subscribe(() => {
            this.channels = this.channels.filter(item => item.id !== channel.id);
            this.applyFilters();
          });
        }
      });
  }
}
