import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';


@Injectable()
export class TestService {
  private socket;

  constructor() {}
  getProblem() {
    let observable = new Observable(observer => {
      this.socket = io('http://localhost:5000');
      this.socket.on('problem', (data) => { observer.next(data); });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }
}
