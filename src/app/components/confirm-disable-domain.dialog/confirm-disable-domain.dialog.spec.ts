import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDisableDomainDialog } from './confirm-disable-domain.dialog';

describe('ConfirmDisableDomainDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDisableDomainDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, hostname: 'example.com' } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    expect(TestBed.createComponent(ConfirmDisableDomainDialog).componentInstance.data.hostname).toBe('example.com');
  });
});
