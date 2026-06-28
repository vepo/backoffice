import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UsersViewComponent } from './users-view.component';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { createMatDialogSpy } from '../../testing/material-stubs';
import { MatDialog } from '@angular/material/dialog';

describe('UsersViewComponent', () => {
  let component: UsersViewComponent;
  let fixture: ComponentFixture<UsersViewComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  const user = {
    id: 1, username: 'u', name: 'U', email: 'u@x.com', profiles: [], disabled: false,
    createdAt: new Date(), updatedAt: new Date()
  };

  beforeEach(async () => {
    usersService = jasmine.createSpyObj('UsersService', ['search', 'disable', 'enable']);
    usersService.search.and.returnValue(of([user]));

    await TestBed.configureTestingModule({
      imports: [UsersViewComponent],
      providers: [
        provideRouter([]),
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['recovery']) },
        { provide: MatDialog, useValue: createMatDialogSpy() },
        {
          provide: ActivatedRoute,
          useValue: { data: of({ users: [user], availableRoles: [], availableProfiles: [] }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadUsersFromResolver', () => {
    expect(component.users.length).toBe(1);
  });

  it('shouldUpdateSearch', () => {
    component.updateSearch();
    expect(usersService.search).toHaveBeenCalled();
  });
});
