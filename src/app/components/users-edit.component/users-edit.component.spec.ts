import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UsersEditComponent } from './users-edit.component';
import { UsersService } from '../../services/users.service';

describe('UsersEditComponent', () => {
  let component: UsersEditComponent;
  let usersService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    usersService = jasmine.createSpyObj('UsersService', ['create', 'update']);
    usersService.create.and.returnValue(of({
      id: 2, username: 'newuser', name: 'New', email: 'n@x.com', profiles: [], disabled: false,
      createdAt: new Date(), updatedAt: new Date()
    }));

    await TestBed.configureTestingModule({
      imports: [UsersEditComponent],
      providers: [
        provideRouter([]),
        { provide: UsersService, useValue: usersService },
        {
          provide: ActivatedRoute,
          useValue: { data: of({ user: null, availableRoles: [], availableProfiles: [{ id: 1, name: 'Admin', roles: [], disabled: false }] }) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(UsersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldStartInCreateMode', () => {
    expect(component.editMode).toBeFalse();
  });

  it('shouldCreateUserOnSubmit', () => {
    spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    component.userForm.setValue({ username: 'newuser', name: 'New', email: 'n@x.com', profileIds: [1] });
    component.save();
    expect(usersService.create).toHaveBeenCalled();
  });
});
