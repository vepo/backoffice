import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Comment, WordCloudEntry } from '../../services/engage.service';

type CommentsContext = 'video' | 'channel';

@Component({
  selector: 'app-comments-view',
  imports: [MatIconModule, MatButtonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './comments-view.component.html'
})
export class CommentsViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  wordCloud: WordCloudEntry[] = [];
  textFilter = '';
  context: CommentsContext = 'video';
  contextId = 0;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments, wordCloud }) => {
      this.comments = comments ?? [];
      this.wordCloud = wordCloud ?? [];
      this.applyFilters();
    });

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('videoId')) {
        this.context = 'video';
        this.contextId = Number(params.get('videoId'));
      } else if (params.has('channelId')) {
        this.context = 'channel';
        this.contextId = Number(params.get('channelId'));
      }
    });
  }

  applyFilters(): void {
    const query = this.textFilter.trim().toLowerCase();
    this.filteredComments = this.comments.filter(comment =>
      !query ||
      comment.text?.toLowerCase().includes(query) ||
      comment.authorName?.toLowerCase().includes(query)
    );
  }

  clearFilters(): void {
    this.textFilter = '';
    this.applyFilters();
  }

  wordFontSize(entry: WordCloudEntry): number {
    if (this.wordCloud.length === 0) {
      return 16;
    }

    const counts = this.wordCloud.map(item => item.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    if (min === max) {
      return 28;
    }

    const ratio = (entry.count - min) / (max - min);
    return Math.round(14 + ratio * 26);
  }

  backLink(): string[] {
    return this.context === 'channel'
      ? ['/', 'channels']
      : ['/', 'videos'];
  }

  backLabel(): string {
    return this.context === 'channel' ? 'Voltar para Canais' : 'Voltar para Vídeos';
  }

  pageTitle(): string {
    return this.context === 'channel'
      ? `Comentários do Canal #${this.contextId}`
      : `Comentários do Vídeo #${this.contextId}`;
  }
}
