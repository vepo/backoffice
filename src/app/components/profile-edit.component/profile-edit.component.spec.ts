import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProfileEditComponent } from './profile-edit.component';
import { ProfileService } from '../../services/profile.service';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let profileService: jasmine.SpyObj<ProfileService>;

  beforeEach(async () => {
    profileService = jasmine.createSpyObj('ProfileService', ['create', 'update']);
    profileService.create.and.returnValue(of({ id: 1, name: 'Admin', roles: [], disabled: false }));

    await TestBed.configureTestingModule({
      imports: [ProfileEditComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileService },
        { provide: ActivatedRoute, useValue: { data: of({ profile: null, availableRoles: [{ id: 1, name: 'passport.admin' }] }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldCreateProfileOnSubmit', () => {
    spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    component.profileForm.setValue({ name: 'NewProfile', roleIds: [1] });
    component.save();
    expect(profileService.create).toHaveBeenCalled();
  });
});
