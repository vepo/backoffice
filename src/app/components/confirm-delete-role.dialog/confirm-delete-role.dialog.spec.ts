import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteRoleDialog } from './confirm-delete-role.dialog';

describe('ConfirmDeleteRoleDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteRoleDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, name: 'passport.admin' } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    expect(TestBed.createComponent(ConfirmDeleteRoleDialog).componentInstance).toBeTruthy();
  });
});
