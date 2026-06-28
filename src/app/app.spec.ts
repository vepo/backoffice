import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { createNotificationServiceStub, emitUnreadCountChanged } from './testing/notification-service-stub';
import { NotificationService } from './services/notification.service';

describe('App', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn', 'logout', 'hasRole']);
    authService.isLoggedIn.and.returnValue(false);
    authService.hasRole.and.returnValue(false);
    notificationService = createNotificationServiceStub();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notificationService }
      ]
    }).compileComponents();
  });

  it('shouldCreateTheApp', () => {
    fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shouldRenderBrand', () => {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('Backoffice');
  });

  it('shouldShowNotificationBellWhenAuthenticated', () => {
    authService.isLoggedIn.and.returnValue(true);
    notificationService.getUnreadCount.and.returnValue(of({ count: 3 }));

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.notification-bell')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.notification-badge')?.textContent).toBe('3');
  });

  it('shouldHideNotificationBadgeWhenNotAuthenticated', () => {
    authService.isLoggedIn.and.returnValue(false);
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.notification-bell')).toBeNull();
  });

  it('shouldCapNotificationBadgeAt99Plus', () => {
    authService.isLoggedIn.and.returnValue(true);
    notificationService.getUnreadCount.and.returnValue(of({ count: 150 }));

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.notification-badge')?.textContent).toBe('99+');
  });

  it('shouldLogoutAndNavigateToLogin', () => {
    fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture.componentInstance.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('shouldRefreshUnreadCountOnNotificationChange', () => {
    authService.isLoggedIn.and.returnValue(true);
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    notificationService.getUnreadCount.calls.reset();
    emitUnreadCountChanged(notificationService);
    expect(notificationService.getUnreadCount).toHaveBeenCalled();
  });
});
