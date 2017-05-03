import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

declare const window: any;

export class DashboardService {

  private url = window.location.origin;
  private socket: any;

  constructor() { }

  getSessionList(email: string) {
    return new Observable(observer => {
      this.socket = io(this.url, {
        query: `user=${email}`,
        reconnection: true
      });

      // tell socket.io to never give up :)
      this.socket.on('error', () => {
        this.socket.socket.reconnect();
      });

      this.socket.on('setSessionList', (sessions) => {
        observer.next(sessions);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }
}
