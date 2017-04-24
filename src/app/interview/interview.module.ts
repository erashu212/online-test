import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@angular/material';

import { InterviewComponent } from './interview.component';

@NgModule({
  declarations: [
    InterviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    InterviewComponent
  ]
})
export class InterviewModule {}
