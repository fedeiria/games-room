import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

import { IDialog } from '../../../../interfaces/dialog/idialog';

@Component({
  selector: 'app-dialog',
  imports: [ MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss'
})
export class Dialog {

  constructor(@Inject(MAT_DIALOG_DATA) public message: IDialog) { }
}
