import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/takeUntil';

import { AuthService } from '../login/login.services';

import * as io from 'socket.io-client';

declare const window: any;

@Injectable()
export class AdminServerApiService {

  private url = window.location.origin;
  private socket: any;

  unsubscribe$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private authService: AuthService) {
    this.socket = io(this.url, {
        query: `client_type=admin`,
        reconnection: true
      });

      this.socket.on('connect', () => {
        this.authService.token$
        // .takeUntil(this.unsubscribe$)
        .subscribe(token => {
          if (token) {
            this.socket.emit('updateToken', token);
          }
        });
      });
  }

  getSessionList() {
    return new Promise((resolve, reject) => {
      // TODO: Do we need timeout or error handling here?
      this.socket.emit('getSessionList', (sessions: object) => {
        resolve(sessions);
      });
    });
  }

  createSession(data: string) {
    return new Promise((resolve, reject) => {
      // TODO: Do we need timeout or error handling here?
      this.socket.emit('createSession', data, (sessionId: string) => {
        resolve(sessionId);
      });
    });
  }

  onDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
