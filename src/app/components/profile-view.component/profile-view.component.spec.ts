import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProfileViewComponent } from './profile-view.component';
import { ProfileService } from '../../services/profile.service';
import { createMatDialogSpy } from '../../testing/material-stubs';
import { MatDialog } from '@angular/material/dialog';

describe('ProfileViewComponent', () => {
  let component: ProfileViewComponent;
  let profileService: jasmine.SpyObj<ProfileService>;

  beforeEach(async () => {
    profileService = jasmine.createSpyObj('ProfileService', ['search']);
    profileService.search.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ProfileViewComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileService },
        { provide: MatDialog, useValue: createMatDialogSpy() },
        {
          provide: ActivatedRoute,
          useValue: { data: of({ profiles: [{ id: 1, name: 'Admin', roles: [], disabled: false }], availableRoles: [] }) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadProfilesFromResolver', () => {
    expect(component.profiles.length).toBe(1);
  });
});
