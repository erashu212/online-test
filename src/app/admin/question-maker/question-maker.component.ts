import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener
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

import { AuthService } from '../../login/login.services';
import { AdminServerApiService } from '../admin.server.api.service';

declare const showdown: any, window: any;

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
  private email: string;

  constructor(
    private dialog: MdDialog,
    public sanitizer: DomSanitizer,
    private dialogService: DialogsService,
    private authService: AuthService,
    private adminServerApiService: AdminServerApiService
  ) { }

  ngOnInit() {
    this.converter = new Converter();

    this._subs.push(
      this.authService.email$.subscribe((email: string) => this.email = email)
    );
  }

  ngOnDestroy() {
    while (this._subs.length) {
      this._subs.pop().unsubscribe();
    }
  }

  @HostListener('window:beforeunload')
  beforeUnload() {
    return !this.data ? 'You are about to lose data.' : '';
  }

  textChanged(text: string) {
    // TODO: Save the text locally or at server so that the user can continue editing
    //       across sessions.
    this.parseTOML(text);
  }

  generateInterviewURL() {
    // TODO: User shouldn't be able to click the button if `this.data` is not valid.
    //       Disable the button if `this.data` is not valid.
    this.adminServerApiService.createSession(this.data).then(
      sessionId => {
        this.dialogService.confirm('URL', `${window.location.origin}/test/${sessionId}`);
      }
    );
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
