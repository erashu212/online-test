import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule, MdButtonModule } from '@angular/material';

import { AceEditorModule } from 'ng2-ace-editor';

import { QuestionMakerComponent } from './question-maker/index';
import { DashboardComponent } from './dashboard/index';
import { AdminComponent } from './admin.component';
import { AdminServerApiService } from './admin.server.api.service';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
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
    AdminServerApiService
  ]
})
export class AdminModule { }
