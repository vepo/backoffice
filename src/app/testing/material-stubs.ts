import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

export function createMatDialogSpy(confirmed = true): jasmine.SpyObj<MatDialog> {
  const dialogRef = {
    afterClosed: () => of(confirmed)
  } as MatDialogRef<unknown>;

  const spy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
  spy.open.and.returnValue(dialogRef);
  return spy;
}
