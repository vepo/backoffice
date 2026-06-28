import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RolesEditComponent } from './roles-edit.component';
import { RoleService } from '../../services/roles.service';

describe('RolesEditComponent', () => {
  let roleService: jasmine.SpyObj<RoleService>;

  beforeEach(async () => {
    roleService = jasmine.createSpyObj('RoleService', ['create']);
    roleService.create.and.returnValue(of({ id: 1, name: 'new.role' }));

    await TestBed.configureTestingModule({
      imports: [RolesEditComponent],
      providers: [
        provideRouter([]),
        { provide: RoleService, useValue: roleService },
        { provide: ActivatedRoute, useValue: { data: of({ role: null }) } }
      ]
    }).compileComponents();
  });

  it('shouldCreateRoleOnSubmit', () => {
    const fixture = TestBed.createComponent(RolesEditComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    component.roleForm.setValue({ name: 'new.role' });
    component.save();
    expect(roleService.create).toHaveBeenCalled();
  });
});
