import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import 'brace/theme/chrome';

import * as io from 'socket.io-client';
import { Converter } from 'showdown';

import * as fossilDelta from 'fossil-delta';

import { AdminServerApiService } from '../admin.server.api.service';
import { AuthService } from '../../login/login.services';

declare const window: any;

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css'
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  sessions$: Observable<any>;
  converter: Converter;
  sessionProblem: any;

  constructor(
    private adminServerApiService: AdminServerApiService,
    private authService: AuthService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.converter = new Converter();

    // TODO: Update using observable.
    this.sessions$ = Observable.fromPromise(this.adminServerApiService.getSessionList());
  }

  ngOnDestroy() {
    this.adminServerApiService.onDestroy();
  }

  showAnswer(answer: any[]) {
    let text: any = [];
    for (let i = 0; i < answer.length; i++) {
      text = fossilDelta.apply(text, answer[i][1]);
    }

    return String.fromCharCode.apply(null, new Uint16Array(text));
  }
}
