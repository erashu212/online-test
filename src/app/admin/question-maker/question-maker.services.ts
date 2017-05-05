import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';

import { httpRequest } from '../../shared/services/httpRequest';

@Injectable()
export class QuestionMakerService {
  constructor(
    private http: Http
  ) {

  }

  saveTest(test, token) {
    return httpRequest(this.http, {
      url: '/api/admin/question',
      method: RequestMethod.Post,
      body: {
        test: test,
        token: token
      }
    });
  }
}
