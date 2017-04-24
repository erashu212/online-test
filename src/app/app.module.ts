import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { DialogsModule } from './shared/components/confirm-dialog';

import { InterviewModule } from './interview';
import { AdminModule } from './admin';
import { LoginModule } from './login';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AdminModule,
    BrowserAnimationsModule,
    BrowserModule,
    DialogsModule,
    FormsModule,
    HttpModule,
    InterviewModule,
    LoginModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
