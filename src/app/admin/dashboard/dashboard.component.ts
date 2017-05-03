import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import 'brace/theme/chrome';

import * as io from 'socket.io-client';
import { Converter } from 'showdown/dist/showdown';

import * as fossilDelta from 'fossil-delta';

import { DashboardService } from './dashboard.service';
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
    private dashboardService: DashboardService,
    private authService: AuthService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.converter = new Converter();

    this._subs.push(
      this.authService.getUserEmail().subscribe((email: string) => {
        this.dashboardService.getSessionList(email).subscribe((res: Array<any>) => {
          this.sessions = res;
        });
      })
    );
  }

  ngOnDestroy() {
    while (this._subs.length) {
      this._subs.pop().unsubscribe();
    }
  }

  showAnswer(diff) {
    return fossilDelta.apply('', diff);
  }
}
