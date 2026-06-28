import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteChannelDialog } from './confirm-delete-channel.dialog';

describe('ConfirmDeleteChannelDialog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteChannelDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, youtubeId: 'UC1234567890123456789012' } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();
  });

  it('shouldCreate', () => {
    expect(TestBed.createComponent(ConfirmDeleteChannelDialog).componentInstance.data.youtubeId).toContain('UC');
  });
});
