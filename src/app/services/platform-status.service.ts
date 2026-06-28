import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, timeout } from 'rxjs';

export type ServiceHealthStatus = 'UP' | 'DOWN' | 'CHECKING';

export type PlatformStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE' | 'CHECKING';

export interface MicroserviceDefinition {
  id: string;
  name: string;
  description: string;
  healthUrl: string;
  devPort: number;
  icon: string;
  planned?: boolean;
}

export interface HealthCheckDetail {
  name: string;
  status: string;
}

export interface MicroserviceHealth {
  service: MicroserviceDefinition;
  status: ServiceHealthStatus;
  latencyMs?: number;
  lastChecked?: Date;
  errorMessage?: string;
  checks: HealthCheckDetail[];
}

interface QuarkusHealthResponse {
  status: string;
  checks?: Array<{ name: string; status: string }>;
}

const HEALTH_TIMEOUT_MS = 5000;

export const MICROSERVICES: MicroserviceDefinition[] = [
  {
    id: 'passport',
    name: 'Passport',
    description: 'Identidade, autenticação e autorização',
    healthUrl: '/passport/q/health',
    devPort: 8080,
    icon: 'badge'
  },
  {
    id: 'visita',
    name: 'Visita',
    description: 'Domínios e rastreamento de acessos',
    healthUrl: '/visita/q/health',
    devPort: 8081,
    icon: 'insights'
  },
  {
    id: 'engage',
    name: 'Engage',
    description: 'YouTube — canais, vídeos e estatísticas',
    healthUrl: '/engage/q/health',
    devPort: 8082,
    icon: 'smart_display'
  }
];

@Injectable({ providedIn: 'root' })
export class PlatformStatusService {
  private readonly http = inject(HttpClient);

  checkAll(): Observable<MicroserviceHealth[]> {
    const checks = MICROSERVICES.map(service => this.checkService(service));
    return forkJoin(checks);
  }

  checkService(service: MicroserviceDefinition): Observable<MicroserviceHealth> {
    const startedAt = performance.now();

    return this.http.get<QuarkusHealthResponse>(service.healthUrl).pipe(
      timeout(HEALTH_TIMEOUT_MS),
      map(response => this.toHealth(service, response, startedAt)),
      catchError(error => of(this.toDown(service, error, startedAt)))
    );
  }

  aggregateStatus(services: MicroserviceHealth[]): PlatformStatus {
    if (services.length === 0 || services.every(item => item.status === 'CHECKING')) {
      return 'CHECKING';
    }

    const upCount = services.filter(item => item.status === 'UP').length;

    if (upCount === services.length) {
      return 'OPERATIONAL';
    }

    if (upCount === 0) {
      return 'OUTAGE';
    }

    return 'DEGRADED';
  }

  private toHealth(
    service: MicroserviceDefinition,
    response: QuarkusHealthResponse,
    startedAt: number
  ): MicroserviceHealth {
    return {
      service,
      status: response.status === 'UP' ? 'UP' : 'DOWN',
      latencyMs: Math.round(performance.now() - startedAt),
      lastChecked: new Date(),
      checks: (response.checks ?? []).map(check => ({
        name: check.name,
        status: check.status
      }))
    };
  }

  private toDown(
    service: MicroserviceDefinition,
    error: unknown,
    startedAt: number
  ): MicroserviceHealth {
    return {
      service,
      status: 'DOWN',
      latencyMs: Math.round(performance.now() - startedAt),
      lastChecked: new Date(),
      errorMessage: this.formatError(error),
      checks: []
    };
  }

  private formatError(error: unknown): string {
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status?: number }).status;
      if (status === 0) {
        return 'Serviço indisponível ou proxy não configurado';
      }
      if (status) {
        return `Resposta HTTP ${status}`;
      }
    }

    return 'Não foi possível alcançar o serviço';
  }
}
