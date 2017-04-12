import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MdDialog } from '@angular/material';

import { parse } from 'toml';
import { Converter } from "showdown/dist/showdown";

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
      <b>Ques {{idx + 1}}.</b><markdown>
        <div [innerHTML]="sanitizer.bypassSecurityTrustHtml(converter.makeHtml(quest?.question))"
        ></div>
        <label>Time limit:</label> {{quest?.time_limit}}
      </markdown>
    </div>
  `
})
export class InterviewPanelComponent {

  data: IInterviewPanel.InterviewTest;
  converter: Converter;

  @ViewChild('editor') editor;
  text: string = "";

  constructor(
    public sanitizer: DomSanitizer,
    private dialog: MdDialog
  ) { }

  ngAfterViewInit() {
    this.converter = new Converter();
  }

  parseTOML(term: string) {
    try {
      this.data = <IInterviewPanel.InterviewTest>(parse(term));

    } catch (error) {
      //alert('Not a valid format!')
    }
  }
}