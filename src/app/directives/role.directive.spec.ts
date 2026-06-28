import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { RoleDirective } from './role.directive';
import { AuthService } from '../services/auth.service';
import { buildValidJwt } from '../testing/jwt-fixtures';

@Component({
  template: `<div *role="'passport.admin'" id="admin-only">Admin</div>`,
  imports: [RoleDirective]
})
class HostComponent {}

describe('RoleDirective', () => {
  let authService: AuthService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideHttpClient(), AuthService]
    }).compileComponents();
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('shouldShowContentWhenUserHasRole', () => {
    authService.saveToken(buildValidJwt(['passport.admin']));
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#admin-only')).toBeTruthy();
  });

  it('shouldHideContentWhenUserLacksRole', () => {
    authService.saveToken(buildValidJwt(['domains.admin']));
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#admin-only')).toBeNull();
  });

  it('shouldToggleOnRoleChange', () => {
    authService.saveToken(buildValidJwt(['domains.admin']));
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#admin-only')).toBeNull();

    authService.saveToken(buildValidJwt(['passport.admin']));
    fixture.componentInstance = fixture.componentInstance;
    fixture.destroy();
    const fixture2 = TestBed.createComponent(HostComponent);
    fixture2.detectChanges();
    expect(fixture2.nativeElement.querySelector('#admin-only')).toBeTruthy();
  });
});
