import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { Headers, Request, Response, URLSearchParams, BrowserXhr } from '@angular/http';

declare const process: any, window: any;

const _defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export function httpRequest(http: Http, options: any): Observable<any> {
  if (options.body) {
    if (typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body);
    }
  }

  if (options.search) {
    if (typeof options.search !== 'string') {
      options.search = new URLSearchParams(options.search);
    }
  }

  options.headers = new Headers(!!options.headers
    ? Object.assign({}, _defaultHeaders, options.headers)
  : _defaultHeaders);

 // options.url = `${window.apiServer + options.url}`;

  return http.request(new Request(options))
    .map((res: Response) => res.json())
    .share();
}
