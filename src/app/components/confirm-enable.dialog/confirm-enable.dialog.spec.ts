import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmEnableDialog } from './confirm-enable.dialog';

describe('ConfirmEnableDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEnableDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, username: 'u', email: 'u@x.com', name: 'U', roles: [] } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    const fixture = TestBed.createComponent(ConfirmEnableDialog);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
