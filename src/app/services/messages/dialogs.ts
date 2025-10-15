import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { IDialog } from '../../interfaces/dialog/idialog';
import { Dialog } from '../../components/shared/messages/dialog/dialog';

@Injectable({
  providedIn: 'root'
})
export class Dialogs {
  
  constructor(private matDialog: MatDialog) { }

  showDialogMessage(data: IDialog): Promise<any> {
    // abro el dialogo y obtengo la referencia
    const dialogRef: MatDialogRef<Dialog> = this.matDialog.open(Dialog, { data });

    // convierto el observable de cierre (afterClosed) a una promesa
    return firstValueFrom(dialogRef.afterClosed());
  }
}
