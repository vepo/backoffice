import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface DomainViewCount {
  hostname: string;
  views: number;
}

export interface PageViewCount {
  path: string;
  views: number;
}

export interface StatsSummary {
  totalViews: number;
  daysInRange: number;
  monitoredPages: number;
  topDomains: DomainViewCount[];
  topPagesLastWeek: PageViewCount[];
}

export interface StatsDateRange {
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/visita/api/stats/summary';

  summary(range?: StatsDateRange): Observable<StatsSummary> {
    let params = new HttpParams();
    const effectiveRange = range ?? this.defaultRange();

    params = params.set('startDate', effectiveRange.startDate);
    params = params.set('endDate', effectiveRange.endDate);

    return this.http.get<StatsSummary>(this.API_URL, { params });
  }

  defaultRange(): StatsDateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    return {
      startDate: this.toIsoDate(start),
      endDate: this.toIsoDate(end)
    };
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
