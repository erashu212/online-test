import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import 'brace/theme/chrome';

import * as io from 'socket.io-client';
import { Converter } from 'showdown/dist/showdown';

declare const window: any;

@Component({
  templateUrl: './dashboard-details.component.html'
})
export class DashboardDetailsComponent {
  isConnected = false;
  isConnecting = false;
  sessions: any[];

  private socket: any;
  private converter: Converter;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params
      .map(p => p['id'])
      .subscribe(id => {
        if (!!id) {
          this.socket = io.connect(window.location.origin, {
            query: `id=${id}`,
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
        }
      });
  }
}
