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
import { IQuestionMaker } from './question-maker.interfaces';

declare var showdown: any;

@Component({
  selector: 'app-question-maker',
  templateUrl: './question-maker.component.html'
})
export class QuestionMakerComponent implements OnInit, OnDestroy {

  data: Array<IQuestionMaker.Problem>;
  converter: Converter;
  isPreviewMode = false;

  private term = '';
  private isInvalidTOML = false;
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
    this.parseTOML(text);
  }

  onPreview() {
    if (this.isInvalidTOML) {
      this.isPreviewMode = false;
      this.dialogService.confirm('Invalid Format', 'Question is missing from your problem set.');
      return;
    }
    this.isPreviewMode = true;
  }

  generateInterviewURL() {
    if (this.isInvalidTOML) {
      this.dialogService.confirm('Invalid Format', 'Question is missing from your problem set.');
      return;
    }

    if (!_.isEmpty(this.data)) {
      this._subs.push(
        this.quesService.saveQuestion(this.data).subscribe(res => {
          if (!!res && !!res['data']) {
            this.dialogService.confirm('URL', `http://localhost:4200/test/${res.data}`);
          }
        })
      );
    }
  }

  private parseTOML(term: string) {
    try {
      const data = parse(term);
      this.data = <Array<IQuestionMaker.Problem>>_.get(data, 'problem');
      this.isInvalidTOML = !this.data || !this.data.some(v => 'question' in v);
    } catch (error) {
      this.isInvalidTOML = true;
    }
  }
}
