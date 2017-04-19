import { Component, OnInit, ViewChild } from '@angular/core';

import * as io from 'socket.io-client';
import { Converter } from 'showdown/dist/showdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isConnected = false;
  isConnecting = false;

  private socket: any;
  private converter: Converter;
  private questionHtml: string;
  private remainingTimeDate: Date;
  private uId = Math.floor(Math.random() * 3).toString();
  private isFinished = false;

  ngOnInit() {
    this.converter = new Converter();
    this.socket = io.connect('http://localhost:4200', {
      query: `id=${this.uId}`,
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
      this.questionHtml = this.converter.makeHtml(questionToml);
    });

    this.socket.on('setRemainingTime', (remainingTimeMs: number) => {
      this.remainingTimeDate = new Date(remainingTimeMs);
    });

    this.socket.on('setTestFinished', () => {
      this.isFinished = true;
    });

    // TODO: errror log on unhandled socket IO function call.
  }

  getNextQuestion() {
    this.socket.emit('nextQuestion');
  }
}
