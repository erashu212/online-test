import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';

import { MdDialog } from '@angular/material';

import { parse } from 'toml';
import 'brace/theme/chrome';
import 'brace/mode/toml';

import { Converter } from 'showdown/dist/showdown';

import * as _ from 'lodash';

import { DialogsService } from '../../shared/components/confirm-dialog';

import { QuestionMakerService } from './question-maker.services';

declare const showdown: any;

@Component({
  selector: 'app-question-maker',
  templateUrl: './question-maker.component.html',
  styles: [':host{flex:1}']
})
export class QuestionMakerComponent implements OnInit, OnDestroy {

  // TODO: Some members are public even if it's only accessed in this class
  // or the corresponding html template.  However, currently Angular does not
  // compile with --aot option if it's private and used in the html template.
  // https://github.com/angular/angular/issues/11422.

  // TODO: `data` is too general variable name.
  public data: string;
  public converter: Converter;
  public isInvalidTOML = false;
  public parseError = null;
  private _subs: Array<Subscription> = [];

  constructor(
    private dialog: MdDialog,
    private quesService: QuestionMakerService,
    public sanitizer: DomSanitizer,
    private dialogService: DialogsService
  ) { }

  ngOnInit() {
    this.converter = new Converter();
  }

  ngOnDestroy() {
    while (this._subs.length) {
      this._subs.pop().unsubscribe();
    }
  }

  textChanged(text: string) {
    // TODO: Save the text locally or at server so that the user can continue editing
    //       across sessions.
    this.parseTOML(text);
  }

  generateInterviewURL() {
    if (!_.isEmpty(this.data)) {
      this._subs.push(
        this.quesService.saveTest(this.data).subscribe(res => {
          if (!!res && !!res['sessionId']) {
            this.dialogService.confirm('URL', `http://localhost:4200/test/${res.sessionId}`);
          }
        })
      );
    }
  }

  private parseTOML(term: string) {
    // TODO: Parsing is a heavyweight task.  It's better to do it background using webworker.
    try {
      this.data = parse(term);
      // TODO: Even if the parsing is successful, the config can be still invalid for many reasons e.g.,
      //       - Having incorrect field, e.g., [[problen]].
      //       - Not having necessary field, e.g., question or time_limit.
      //       - Incorrect Markdown format for question text
      //       - Incorrect format for time_limit, e.g., time_limit = "hello";
      // TODO: Use JSON Schema validator https://github.com/epoberezkin/ajv .
      this.isInvalidTOML = false;
    } catch (error) {
      console.log(error);
      this.parseError = error;
      this.isInvalidTOML = true;
    }
  }
}
