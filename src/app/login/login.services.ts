import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/toPromise';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import * as _ from 'lodash';
import { httpRequest } from '../shared/services/httpRequest';

// TODO: Rename the file name to firebase.auth.service.ts, also same for the other files in this folder.

@Injectable()
export class AuthService {
  readonly token$: Observable<string>;
  readonly email$: Observable<string>;
  token: string;

  // TODO: We only use AngularFireAuth here, maybe we should import that directly instead of
  //       AngularFire?
  constructor(private afAuth: AngularFireAuth) {
    this.token$ = this.afAuth.authState.concatMap((user: firebase.User) => {
      if (user) {
        // TODO: What should we do for token expiration and refresh?
        return user.getToken(false);
      } else {
        return Promise.resolve(null);
      };
    });
    this.token$.subscribe(token => this.token = token);

    this.email$ = this.afAuth.authState.map(user => {
      return user ? user.email : undefined;
    });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }
}
