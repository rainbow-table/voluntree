import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login-page';
import { NpDashPage } from '../pages/np-dash/np-dash';
import { VolunteerDashPage } from '../pages/volunteer-dash/volunteer-dash';
import { NploginPage } from '../pages/nplogin/nplogin';
import { VolunteerloginPage } from '../pages/volunteerlogin/volunteerlogin';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgCalendarModule } from 'ionic2-calendar';
import { OAuthModule } from '../pages/oauth/oauth.module';
import { Config } from '../config';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    NpDashPage,
    VolunteerDashPage,
    NploginPage,
    VolunteerloginPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    OAuthModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    NpDashPage,
    VolunteerDashPage,
    NploginPage,
    VolunteerloginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Config,
  ]
})
export class AppModule {}
