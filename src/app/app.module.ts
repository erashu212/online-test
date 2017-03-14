import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { ProblemComponent } from './problem/problem.component';
import { TestService } from './test.service';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    ProblemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule
  ],
  providers: [TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
