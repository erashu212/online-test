import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

import * as _ from 'lodash';

import { httpRequest } from '../shared/services/httpRequest';

@Injectable()
export class AuthService {

  constructor(
    private af: AngularFire, private http: Http
  ) { }

  getUserEmail() {
    return this.af.auth.map(user => _.get(user, `auth.email`));
  }

  logout() {
    return this.af.auth.logout();
  }

  saveSession(credentials: any) {
    return httpRequest(this.http, {
      url: '/api/admin/session',
      method: RequestMethod.Post,
      body: {
        user: credentials
      }
    });
  }

  destroySession() {
    return httpRequest(this.http, {
      url: '/api/admin/session',
      method: RequestMethod.Delete
    }).toPromise();
  }
}
