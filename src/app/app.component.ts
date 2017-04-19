import { Component, OnInit, ViewChild } from '@angular/core';

import * as io from 'socket.io-client';
import { Converter } from 'showdown/dist/showdown';
import 'hammerjs'

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
  private remainingTime: Date;
  private problemTimeout: Date;
  private uId = Math.floor(Math.random() * 3).toString();
  private isFinished = false;
  private clockUpdateTimeout: any;

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
      this.problemTimeout = new Date(new Date().getTime() + remainingTimeMs);
      this.updateTime();
    });

    this.socket.on('setTestFinished', () => {
      this.isFinished = true;
    });

    // TODO: errror log on unhandled socket IO function call.
  }

  getNextQuestion() {
    this.socket.emit('nextQuestion');
  }

  updateTime() {
    clearTimeout(this.clockUpdateTimeout);

    const remainingTimeMs = this.problemTimeout.getTime() - new Date().getTime();
    this.remainingTime = new Date(remainingTimeMs);

    const self = this;
    this.clockUpdateTimeout = setTimeout(() => {
      self.updateTime();
    }, remainingTimeMs % 1000);
  }
}
