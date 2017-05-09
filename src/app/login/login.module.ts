import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseUIAuthConfig, FirebaseUIModule, AuthProviders, AuthMethods } from 'firebaseui-angular';

import { AuthService } from './login.services';
import { LoginComponent } from './login.component';

import { firebaseConfig } from '../../firebase.config';

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProviders.Password,
    AuthProviders.Google
    // TODO: Support the followings also.
    // AuthProviders.Anonymous
    // AuthProviders.Facebook,
    // AuthProviders.Twitter,
    // AuthProviders.Github,
  ],
  method: AuthMethods.Popup,
  tos: ''
};

@NgModule({
  declarations: [LoginComponent],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    CommonModule,
    FormsModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    AuthService,
    AngularFireAuth
  ]
})

export class LoginModule {
}
