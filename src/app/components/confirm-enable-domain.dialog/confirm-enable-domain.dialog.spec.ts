import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmEnableDomainDialog } from './confirm-enable-domain.dialog';

describe('ConfirmEnableDomainDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEnableDomainDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, hostname: 'example.com' } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    expect(TestBed.createComponent(ConfirmEnableDomainDialog).componentInstance).toBeTruthy();
  });
});
