import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { FirebaseUIAuthConfig, FirebaseUIModule } from 'firebaseui-angular';

import { AuthService } from './login.services';
import { LoginComponent } from './login.component';

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProviders.Google,
    AuthProviders.Facebook,
    AuthProviders.Twitter,
    AuthProviders.Github,
    AuthProviders.Password
  ],
  method: AuthMethods.Popup,
  tos: ''
};

const firebaseConfig = {
  apiKey: 'AIzaSyDK1_WxLe0GcY2OhGkrFXmxs9FGxdb-UG4',
  authDomain: 'online-test-bb3cf.firebaseapp.com',
  databaseURL: 'https://online-test-bb3cf.firebaseio.com',
  storageBucket: 'online-test-bb3cf',
  messagingSenderId: 'online-test-bb3cf.appspot.com'
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
