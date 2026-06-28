import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmEnableProfileDialog } from './confirm-enable-profile.dialog';

describe('ConfirmEnableProfileDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEnableProfileDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, name: 'Admin', roles: [] } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    expect(TestBed.createComponent(ConfirmEnableProfileDialog).componentInstance).toBeTruthy();
  });
});
