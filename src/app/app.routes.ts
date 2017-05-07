import { Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { InterviewComponent } from './interview/interview.component';
import {
  AdminComponent,
  DashboardComponent,
  QuestionMakerComponent
} from './admin/index';

export const appRoutes: Routes = [
  {
    path: 'admin',
    canActivate: [ AuthGuard ],
    component: AdminComponent,
    children: [
      { path: '', component: QuestionMakerComponent },
      { path: 'view', component: DashboardComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'test/:id', component: InterviewComponent },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
