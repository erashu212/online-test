import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';

import { MdDialog } from '@angular/material';

import { parse } from 'toml';

import { IInterviewPanel } from './interview-panel.interfaces';

import 'brace/theme/chrome';
import 'brace/mode/toml';

declare var showdown: any;

@Component({
  selector: 'interview-panel',
  template: `
    <ace-editor 
    [autoUpdateContent] = "true"
    [mode] = "'toml'"
    [theme] = "'chrome'"

    (textChanged)="parseTOML($event);"
    #editor style="height:250px;"
    ></ace-editor>

    <div *ngFor="let quest of data?.problem; let idx = index;">
      <b>Ques {{idx + 1}}.</b>
    </div>
  `
})
export class InterviewPanelComponent {

  data: IInterviewPanel.InterviewTest;

  @ViewChild('editor') editor;
  text: string = "";

  constructor(
    private dialog: MdDialog
  ) { }

  parseTOML(term: string) {
    try {
      this.data = <IInterviewPanel.InterviewTest>(parse(term));

    } catch (error) {
      //alert('Not a valid format!')
    }
  }
}