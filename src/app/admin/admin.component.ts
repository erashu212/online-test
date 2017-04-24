import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../login/login.services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  email$: Observable<string>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.email$ = this.authService.getUserEmail();
  }

  logout() {
    this.authService.logout()
      .then(_ => this.authService.destroySession())
      .then(_ => this.router.navigate(['login']));
  }
}
