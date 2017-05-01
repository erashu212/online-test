import { Component } from '@angular/core';

import 'brace/theme/chrome';

import * as io from 'socket.io-client';

declare const window: any;

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  isConnected = false;
  isConnecting = false;
  sessions: any[];

  private socket: any;

  ngOnInit() {
    this.socket = io.connect(window.location.origin, {
      query: `admin=1`,
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

    this.socket.on('setSessionList', (sessions: any[]) => {
      this.sessions = sessions;
    });
  }
}
