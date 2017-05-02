import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import 'brace/theme/chrome';

import * as io from 'socket.io-client';
import { Converter } from 'showdown/dist/showdown';

import * as fossilDelta from 'fossil-delta';

declare const window: any;

@Component({
  templateUrl: './dashboard-details.component.html'
})
export class DashboardDetailsComponent implements OnInit {
  isConnected = false;
  isConnecting = false;
  sessionDetails: any;
  questionHTML: string;
  converter: Converter;

  private socket: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.converter = new Converter();
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

          this.socket.on('showSession', (data) => {
            if (data) {
              this.sessionDetails = Object.assign({}, data, {
                answers: fossilDelta.apply(null, data.answers)
              });

            }
          });
        }
      });
  }
}
