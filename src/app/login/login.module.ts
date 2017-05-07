import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { FirebaseUIAuthConfig, FirebaseUIModule } from 'firebaseui-angular';

import { AuthService } from './login.services';
import { LoginComponent } from './login.component';

// TODO: Don't hardcode.  Read from a separate config file.
const firebaseConfig = {
  apiKey: 'AIzaSyCvxySSZGFj3NVSYFIhNsAYM37osHB4U-I',
  authDomain: 'online-test-dev.firebaseapp.com',
  databaseURL: 'https://online-test-dev.firebaseio.com',
  projectId: 'online-test-dev',
  storageBucket: 'online-test-dev.appspot.com',
  messagingSenderId: '306736793870'
};

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
    AuthService
  ]
})

export class LoginModule {
}
