import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { RoleDirective } from '../../directives/role.directive';
import { AuthService } from '../../services/auth.service';
import {
  MicroserviceHealth,
  PlatformStatus,
  PlatformStatusService
} from '../../services/platform-status.service';
import { StatsService, StatsSummary } from '../../services/stats.service';

@Component({
  selector: 'app-status-view',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    RoleDirective
  ],
  templateUrl: './status-view.component.html'
})
export class StatusViewComponent implements OnInit, OnDestroy {
  private readonly platformStatusService = inject(PlatformStatusService);
  private readonly authService = inject(AuthService);
  private readonly statsService = inject(StatsService);

  private static readonly STATS_ROLES = ['domains.admin', 'Domain.Stats.Viewer'];

  services: MicroserviceHealth[] = [];
  platformStatus: PlatformStatus = 'CHECKING';
  loading = true;
  statsLoading = false;
  stats?: StatsSummary;
  statsError = false;
  lastRefresh?: Date;
  private refreshTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.refresh();
    this.refreshTimer = setInterval(() => this.refresh(false), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  refresh(showSpinner = true): void {
    if (showSpinner) {
      this.loading = true;
    }

    if (this.canViewStats()) {
      this.loadStats(showSpinner);
    }

    this.platformStatusService.checkAll().subscribe({
      next: services => {
        this.services = services;
        this.platformStatus = this.platformStatusService.aggregateStatus(services);
        this.lastRefresh = new Date();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  operationalCount(): number {
    return this.services.filter(service => service.status === 'UP').length;
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  canViewStats(): boolean {
    return this.authService.hasAnyRole(StatusViewComponent.STATS_ROLES);
  }

  openFullDashboard(): void {
    window.open('/visita/dashboard', '_blank', 'noopener');
  }

  private loadStats(showSpinner: boolean): void {
    if (showSpinner) {
      this.statsLoading = true;
    }

    this.statsService.summary().subscribe({
      next: summary => {
        this.stats = summary;
        this.statsError = false;
        this.statsLoading = false;
      },
      error: () => {
        this.statsError = true;
        this.statsLoading = false;
      }
    });
  }

  platformStatusLabel(): string {
    switch (this.platformStatus) {
      case 'OPERATIONAL':
        return 'Todos os sistemas operacionais';
      case 'DEGRADED':
        return 'Degradação parcial detectada';
      case 'OUTAGE':
        return 'Interrupção em um ou mais serviços';
      default:
        return 'Verificando status...';
    }
  }

  platformStatusIcon(): string {
    switch (this.platformStatus) {
      case 'OPERATIONAL':
        return 'check_circle';
      case 'DEGRADED':
        return 'warning';
      case 'OUTAGE':
        return 'error';
      default:
        return 'sync';
    }
  }

  serviceStatusLabel(status: string): string {
    return status === 'UP' ? 'Operacional' : status === 'DOWN' ? 'Indisponível' : 'Verificando';
  }
}
