import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../login/login.services';

import * as io from 'socket.io-client';

declare const window: any;

@Injectable()
export class DashboardService {

  private url = window.location.origin;
  private socket: any;

  constructor(private authService: AuthService) { }

  getSessionList() {
    // TODO: This will create a connection every call, factor the connection part out.
    return new Observable(observer => {
      this.socket = io(this.url, {
        query: `token=` + this.authService.getToken(),
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
