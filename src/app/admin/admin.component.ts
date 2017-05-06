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
    this.email$ = this.authService.email$;
  }

  logout() {
    // TODO: Reset socket IO connection.
    this.authService.logout()
      .then(_ => this.router.navigate(['login']));
  }
}
