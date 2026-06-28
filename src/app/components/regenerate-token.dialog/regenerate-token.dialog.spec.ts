import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegenerateTokenDialog } from './regenerate-token.dialog';

describe('RegenerateTokenDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegenerateTokenDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, hostname: 'example.com' } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    expect(TestBed.createComponent(RegenerateTokenDialog).componentInstance).toBeTruthy();
  });
});
