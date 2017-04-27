import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule, MdButtonModule } from '@angular/material';

import { AceEditorModule } from 'ng2-ace-editor';

import { QuestionMakerComponent, QuestionMakerService } from './question-maker/index';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    QuestionMakerComponent
  ],
  imports: [
    AceEditorModule,
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    AdminComponent,
    MaterialModule,
    QuestionMakerComponent
  ],
  providers: [
    QuestionMakerService
  ]
})
export class AdminModule { }
