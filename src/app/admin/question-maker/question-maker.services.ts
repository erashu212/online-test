import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';

import { httpRequest } from '../../shared/services/httpRequest';

import { IQuestionMaker } from './question-maker.interfaces';

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

  saveQuestion(questions: Array<IQuestionMaker.Problem>) {
    return httpRequest(this.http, {
      url: '/api/admin/question',
      method: RequestMethod.Post,
      body: questions
    });
  }
}
