import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AngularFireAuth } from 'angularfire2/auth';

import { AuthService } from './login.services';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  private _subs: Array<Subscription> = [];

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this._subs.push(
      this.afAuth.authState.subscribe(res => {
        if (res) {
          this.router.navigateByUrl('/admin');
        }
      })
    );
  }

  ngOnDestroy() {
    while (this._subs.length) {
      this._subs.pop().unsubscribe();
    }
  }
}
