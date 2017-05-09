import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';

import { MdSnackBar } from '@angular/material';

import 'brace/theme/chrome';

import * as io from 'socket.io-client';
import { Converter } from 'showdown';

import * as fossilDelta from 'fossil-delta';

import { DialogsService } from '../shared/components/confirm-dialog';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit, OnDestroy {
  isConnected = false;
  isConnecting = false;
  isInvalidTest = false;
  isFinished = false;
  questionHtml: string;
  remainingTime: Date;
  previousAnswerText = '';

  private socket: any;
  private converter: Converter;
  private problemTimeout: Date;
  private clockUpdateTimeout: any;
  private wasRemainingTimeSnackbarShown = false;

  private _subs: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
    public sanitizer: DomSanitizer,
    private dialogService: DialogsService
  ) { }

  ngOnInit() {
    this.converter = new Converter();
    this.route.params
      .map(p => p['id'])
      .subscribe(id => {
        if (!!id) {
          this.socket = io.connect(window.location.origin, {
            query: `client_type=test_taker&id=${id}`,
            reconnection: true
          });

          this.socket.on('connect', () => {
            this.isConnected = true;
            this.isConnecting = false;
          });

          // tell socket.io to never give up :)
          this.socket.on('error', () => {
            this.isConnected = false;
            this.isConnecting = true;
            this.socket.socket.reconnect();
          });

          this.socket.on('setQuestion', (questionToml: string) => {
            this.wasRemainingTimeSnackbarShown = false;
            this.previousAnswerText = '';
            // dismiss confirmation dialog
            this.dialogService.close();

            this.questionHtml = this.converter.makeHtml(questionToml);
          });

          this.socket.on('setRemainingTime', (remainingTimeMs: number) => {
            this.problemTimeout = new Date(new Date().getTime() + remainingTimeMs);
            this.updateTime();
          });

          this.socket.on('setTestFinished', () => {
            this.isFinished = true;
          });

          this.socket.on('setInvalidTest', () => {
            this.isInvalidTest = true;
          });
        }
      });

    // TODO: error log on unhandled socket IO function call.
  }

  ngOnDestroy() {
    this._subs.forEach(subscription => subscription.unsubscribe());
  }

  onAnswerTextUpdate(answer: string) {
    // TODO: Create diff and call server.
    const diff = fossilDelta.create(Buffer.from(this.previousAnswerText, 'utf8'),
                                    Buffer.from(answer, 'utf8'));
    this.previousAnswerText = answer;
    this.socket.emit('answerTextUpdate', diff);
  }

  getNextQuestion() {
    this._subs.push(
      this.dialogService
        .confirm('Confirm Dialog', 'Are you sure you want to do this?')
        .subscribe(res => {
          if (res) {
            // TODO: UI should be frozen between "disable clicked" and "next question received".
            this.socket.emit('nextQuestion');
          }
        })
    );
  }

  updateTime() {
    clearTimeout(this.clockUpdateTimeout);

    const remainingTimeMs = this.problemTimeout.getTime() - new Date().getTime();
    this.remainingTime = new Date(remainingTimeMs);

    //
    if (this.remainingTime.getTime() === 10 * 1000 && !this.wasRemainingTimeSnackbarShown) {
      this.wasRemainingTimeSnackbarShown = true;
      this.showDialog();
    }
    const self = this;
    this.clockUpdateTimeout = setTimeout(() => {
      self.updateTime();
    }, remainingTimeMs % 1000);
  }

  private showDialog() {
    this.snackBar.open(`Remaining Time: ${this.remainingTime.toISOString().substr(11, 8)}`, 'Ok', {
      duration: 2000,
    });
  }
}
