import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EngageService, Video } from '../../services/engage.service';

@Component({
  selector: 'app-videos-view',
  imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, MatTooltipModule, DatePipe],
  templateUrl: './videos-view.component.html'
})
export class VideosViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly engageService = inject(EngageService);

  readonly pageSize = 20;

  videos: Video[] = [];
  total = 0;
  page = 0;
  titleFilter = '';
  loading = false;

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.page = Number(params.get('page') ?? '0');
      if (Number.isNaN(this.page) || this.page < 0) {
        this.page = 0;
      }
      this.loadVideos();
    });
  }

  loadVideos(): void {
    this.loading = true;
    this.engageService.findVideosPage(this.page, this.pageSize, this.titleFilter).subscribe({
      next: page => {
        this.videos = page.items;
        this.total = page.total;
        this.page = page.page;
        this.loading = false;
      },
      error: () => {
        this.videos = [];
        this.total = 0;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.page !== 0) {
      this.goToPage(0);
      return;
    }
    this.loadVideos();
  }

  clearFilters(): void {
    this.titleFilter = '';
    this.applyFilters();
  }

  canGoPrevious(): boolean {
    return this.page > 0;
  }

  canGoNext(): boolean {
    return (this.page + 1) * this.pageSize < this.total;
  }

  currentPageLabel(): number {
    return this.page + 1;
  }

  totalPages(): number {
    return this.total === 0 ? 1 : Math.ceil(this.total / this.pageSize);
  }

  rangeStart(): number {
    return this.total === 0 ? 0 : this.page * this.pageSize + 1;
  }

  rangeEnd(): number {
    return Math.min((this.page + 1) * this.pageSize, this.total);
  }

  previousPage(): void {
    if (this.canGoPrevious()) {
      this.goToPage(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.canGoNext()) {
      this.goToPage(this.page + 1);
    }
  }

  private goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: page === 0 ? null : page },
      queryParamsHandling: 'merge'
    });
  }
}
