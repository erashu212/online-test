import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import * as _ from 'lodash';
import { httpRequest } from '../shared/services/httpRequest';

// TODO: Rename the file name to firebase.auth.service.ts, also same for the other files in this folder.

@Injectable()
export class AuthService {

  private authState: FirebaseAuthState;
  private token: string;

  constructor(private af: AngularFire, private http: Http) {
    this.af.auth.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      if (state) {
        state.auth.getToken(false).then(
          token => {
            this.token = token;
          }
        );
      } else {
        this.token = null;
      }
    });
  }

  getToken() {
    return this.token;
  }

  getUserEmail() {
    return this.af.auth.map(user => _.get(user, `auth.email`));
  }

  logout() {
    return this.af.auth.logout();
  }
}
