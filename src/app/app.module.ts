import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import * as moment from 'moment';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login-page';
import { NpDashPage } from '../pages/np-dash/np-dash';
import { VolunteerDashPage } from '../pages/volunteer-dash/volunteer-dash';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgCalendarModule } from 'ionic2-calendar';
import { OAuthModule } from '../pages/oauth/oauth.module';
import { Config } from '../config';
import { ProPubServiceProvider } from '../providers/pro-pub-service/pro-pub-service';
import { GetNpAddressrProvider } from '../providers/get-np-addressr/get-np-addressr';
import { GrabNpEventsProvider } from '../providers/grab-np-events/grab-np-events';
import { ManageEventsPage } from "../pages/manage-events/manage-events";
import { HttpModule, JsonpModule } from '@angular/http';
import { NpCalProvider } from '../providers/np-cal/np-cal';
import { CreateEventPage } from '../pages/create-event/create-event';
import { EventSelectPage } from '../pages/event-select/event-select';
import { EinPage } from '../pages/ein/ein';
import { IonicStorageModule } from '@ionic/storage';
import { VolunteerMapSearchPage } from '../pages/volunteer-map-search/volunteer-map-search';
import { GrabBadgesProvider } from '../providers/grab-badges/grab-badges';
import {AutocompletePage} from '../pages/autocomplete/autocomplete';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    NpDashPage,
    VolunteerDashPage,
    ManageEventsPage,
    CreateEventPage,
    EinPage,
    EventSelectPage,
    VolunteerMapSearchPage,
    AutocompletePage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgCalendarModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    OAuthModule,
    HttpModule,
    JsonpModule,
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
    ManageEventsPage,
    CreateEventPage,
    EinPage,
    EventSelectPage,
    VolunteerMapSearchPage,
    AutocompletePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Config,
    Geolocation,
    ProPubServiceProvider,
    GetNpAddressrProvider,
    GrabNpEventsProvider,
    NpCalProvider,
    GrabBadgesProvider,
  ]
})
export class AppModule {}
