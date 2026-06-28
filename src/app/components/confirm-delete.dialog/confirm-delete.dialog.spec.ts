import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from './confirm-delete.dialog';

describe('ConfirmDeleteDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, username: 'u', email: 'u@x.com', name: 'U', roles: [] } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteDialog);
    expect(fixture.componentInstance.data.username).toBe('u');
  });
});
