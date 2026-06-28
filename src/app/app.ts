import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RoleDirective } from './directives/role.directive';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    RoleDirective
  ],
  templateUrl: './app.html'
})
export class App implements OnInit, OnDestroy {
  protected title = 'backoffice';
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  isPublicRoute = false;
  unreadNotificationCount = 0;
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.updatePublicRoute(this.router.url);
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(event => {
          const url = (event as NavigationEnd).urlAfterRedirects;
          this.updatePublicRoute(url);
          this.refreshUnreadCount();
        })
    );
    this.subscriptions.add(
      this.notificationService.unreadCountChanged$.subscribe(() => this.refreshUnreadCount())
    );
    this.refreshUnreadCount();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  isPublicAuthRoute(): boolean {
    return this.isPublicRoute;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private updatePublicRoute(url: string): void {
    this.isPublicRoute = url.startsWith('/login') || url.startsWith('/password');
  }

  private refreshUnreadCount(): void {
    if (!this.isAuthenticated() || this.isPublicAuthRoute()) {
      this.unreadNotificationCount = 0;
      return;
    }
    this.notificationService.getUnreadCount().subscribe({
      next: response => {
        this.unreadNotificationCount = response.count;
      },
      error: () => {
        this.unreadNotificationCount = 0;
      }
    });
  }
}
