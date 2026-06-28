import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[] | undefined;

  if (!roles?.length) {
    return true;
  }

  if (roles.some(role => authService.hasRole(role))) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
