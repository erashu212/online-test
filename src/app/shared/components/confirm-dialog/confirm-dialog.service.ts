import { Observable } from 'rxjs/Rx';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    confirm(title: string, message: string): Observable<boolean> {

        let dialogRef: MdDialogRef<ConfirmDialogComponent>;

        dialogRef = this.dialog.open(ConfirmDialogComponent);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    close() {
        this.dialog.closeAll();
    }
}
