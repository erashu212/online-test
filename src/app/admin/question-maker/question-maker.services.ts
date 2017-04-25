import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';

import { httpRequest } from '../../shared/services/httpRequest';

@Injectable()
export class QuestionMakerService {
  constructor(
    private http: Http
  ) {

  }

  getQuestions(setId: string) {
    return httpRequest(this.http, {
      url: '/api/admin/question',
      method: RequestMethod.Get,
      search: setId
    });
  }

  saveTest(test) {
    return httpRequest(this.http, {
      url: '/api/admin/question',
      method: RequestMethod.Post,
      body: test
    });
  }
}
