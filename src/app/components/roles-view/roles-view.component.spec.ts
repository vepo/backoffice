import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RolesViewComponent } from './roles-view.component';
import { RoleService } from '../../services/roles.service';
import { createMatDialogSpy } from '../../testing/material-stubs';
import { MatDialog } from '@angular/material/dialog';

describe('RolesViewComponent', () => {
  let component: RolesViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesViewComponent],
      providers: [
        provideRouter([]),
        { provide: RoleService, useValue: jasmine.createSpyObj('RoleService', ['search', 'delete']) },
        { provide: MatDialog, useValue: createMatDialogSpy() },
        { provide: ActivatedRoute, useValue: { data: of({ roles: [{ id: 1, name: 'passport.admin' }] }) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(RolesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shouldLoadRolesFromResolver', () => {
    expect(component.roles.length).toBe(1);
  });
});
