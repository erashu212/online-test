import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/toPromise';

import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
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
  constructor(private af: AngularFire) {
    this.token$ = this.af.auth.concatMap((state: FirebaseAuthState) => {
      if (state) {
        // TODO: What should we do for token expiration and refresh?
        return state.auth.getToken(false);
      } else {
        return Promise.resolve(null);
      };
    });
    this.token$.subscribe(token => this.token = token);

    this.email$ = this.af.auth.map(user => _.get(user, `auth.email`));
  }

  logout() {
    return this.af.auth.logout();
  }
}
