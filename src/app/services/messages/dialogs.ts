import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IDialog } from '../../interfaces/dialog/idialog';
import { Dialog } from '../../components/shared/messages/dialog/dialog';

@Injectable({
  providedIn: 'root'
})
export class Dialogs {
  
  constructor(private matDialog: MatDialog) { }

  showDialogMessage(data: IDialog) {
    this.matDialog.open(Dialog, { data });
  }
}
