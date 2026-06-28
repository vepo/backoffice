import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EngageService, Video } from '../../services/engage.service';

@Component({
  selector: 'app-videos-view',
  imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule, DatePipe],
  templateUrl: './videos-view.component.html'
})
export class VideosViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  videos: Video[] = [];
  filteredVideos: Video[] = [];
  titleFilter = '';

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ videos }) => {
      this.videos = videos;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const query = this.titleFilter.trim().toLowerCase();
    this.filteredVideos = this.videos.filter(video =>
      !query ||
      video.title?.toLowerCase().includes(query) ||
      video.youtubeId.toLowerCase().includes(query)
    );
  }

  clearFilters(): void {
    this.titleFilter = '';
    this.applyFilters();
  }
}
