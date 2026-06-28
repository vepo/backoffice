import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteProfileDialog } from './confirm-delete-profile.dialog';

describe('ConfirmDeleteProfileDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteProfileDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, name: 'Admin', roles: [] } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    expect(TestBed.createComponent(ConfirmDeleteProfileDialog).componentInstance).toBeTruthy();
  });
});
