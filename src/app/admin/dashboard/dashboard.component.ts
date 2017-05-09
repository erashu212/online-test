import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

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

  sessions: Array<any>;
  converter: Converter;
  sessionProblem: any;

  private _subs: Array<Subscription> = [];

  constructor(
    private adminServerApiService: AdminServerApiService,
    private authService: AuthService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.converter = new Converter();

    // TODO: Update using observable.
    this.adminServerApiService.getSessionList().then((sessions: Array<any>) => {
      this.sessions = sessions;
    });
  }

  ngOnDestroy() {
    this._subs.forEach(subscription => subscription.unsubscribe);
  }

  showAnswer(diff: number[]) {
    return fossilDelta.apply([], diff);
  }
}
