import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as io from 'socket.io-client';
import { Converter } from 'showdown/dist/showdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  converter: Converter;

  private socketServer: any;
  private question: any;
  private uId = '70f0a48011cf4df2ad74482accf8ed90';

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.converter = new Converter();

    this.socketServer = io.connect('http://localhost:4200', { query: `id=${this.uId}` });

    // register user for questions
    // this.socketServer.emit('register', '70f0a48011cf4df2ad74482accf8ed90');

    this.socketServer.on('getQuestion', (data) => {
      this.question = data;
    });

    this.socketServer.on('getQuestionTimer', (data) => {
      this.question = Object.assign({}, this.question, {
        timeRemaining: data
      });
    });
  }

  getNextQuestion() {
    this.socketServer.emit('nextQuestion', `${this.uId}`);
  }

  displayInTimeFormat(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(n) {
    return (n < 10) ? ('0' + n) : n;
  }
}
