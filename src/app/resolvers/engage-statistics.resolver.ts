import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EngageService, PlatformStatistics } from '../services/engage.service';

export const engageStatisticsResolver: ResolveFn<PlatformStatistics> = () => {
  return inject(EngageService).loadPlatformStatistics();
};
