import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login-page';
import { NpDashPage } from '../pages/np-dash/np-dash';
import { VolunteerDashPage } from '../pages/volunteer-dash/volunteer-dash'
import { EinPage } from '../pages/ein/ein';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { ManageEventsPage } from '../pages/manage-events/manage-events';
import { VolunteerMapSearchPage } from '../pages/volunteer-map-search/volunteer-map-search';
import { LoadingController } from 'ionic-angular';
import {AutocompletePage} from '../pages/autocomplete/autocomplete';
import {CreateEventPage} from '../pages/create-event/create-event';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController
  ) {
    
    this.initializeApp();
  
    

    // set our app's pages
    this.pages = [
      {title: 'auto', component: AutocompletePage},
      {title: 'create', component: CreateEventPage}
      // { title: 'Nearby Opportunities', component: ListPage },
      // { title: 'Non-Profit Dash', component: NpDashPage },
      // { title: 'Volunteer Dash', component: VolunteerDashPage },
      // { title: 'Manage Events', component: ManageEventsPage },
      // { title: 'Non-profit Event Search', component: VolunteerMapSearchPage }
    ];
  }

  presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
     spinner: 'dots',
    content: 'Loading, please wait...'
  });

  loading.present();

  setTimeout(() => {
    loading.dismiss();
  }, 5000);
}

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    });
  }

  
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
  
}
