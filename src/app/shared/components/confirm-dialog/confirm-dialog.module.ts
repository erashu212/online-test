import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { DialogsService } from './confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    imports: [
        MaterialModule
    ],
    exports: [
        ConfirmDialogComponent,
    ],
    declarations: [
        ConfirmDialogComponent,
    ],
    providers: [
        DialogsService,
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ],
})
export class DialogsModule { }
