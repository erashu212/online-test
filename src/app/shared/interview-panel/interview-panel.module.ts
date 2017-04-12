import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from 'angular2-markdown';
import { AceEditorModule } from 'ng2-ace-editor';


import { InterviewPanelComponent } from './interview-panel.component';

@NgModule({
  declarations: [ InterviewPanelComponent ],
  imports : [
    AceEditorModule,
    CommonModule,
    MarkdownModule.forRoot()
  ],
  exports: [
    InterviewPanelComponent
  ]
})
export class InterviewPanelModule {}
