import { Component, OnInit, ViewChild } from '@angular/core';

import * as io from 'socket.io-client';
import { Converter } from 'showdown/dist/showdown';
import 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent {
}
