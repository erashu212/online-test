import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as io from 'socket.io-client';
import { Converter } from "showdown/dist/showdown";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  converter: Converter;

  private socketServer: any;
  private question: any;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.converter = new Converter();
    
    this.socketServer = io.connect('http://localhost:4200', {query: 'id=70f0a48011cf4df2ad74482accf8ed90'});

    // register user for questions
    // this.socketServer.emit('register', '70f0a48011cf4df2ad74482accf8ed90');

    this.socketServer.on('getQuestion', (data) => {
      this.question = data;
    })
  }

  displayInTimeFormat(time: number) {
    let mins = Math.trunc(time / 60);
    let hrs = time % 60;

    return `${hrs}:${mins}`
  }
}
