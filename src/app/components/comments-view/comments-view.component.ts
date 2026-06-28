import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Comment } from '../../services/engage.service';

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
  textFilter = '';
  context: CommentsContext = 'video';
  contextId = 0;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments }) => {
      this.comments = comments;
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

  backLink(): string[] {
    return this.context === 'channel'
      ? ['/', 'engage', 'channels']
      : ['/', 'engage', 'videos'];
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
