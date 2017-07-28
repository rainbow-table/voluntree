import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ManageEventsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-manage-events',
  templateUrl: 'manage-events.html',

})
export class ManageEventsPage {
  npevents: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public GrabNpEventsProvider: GrabNpEventsProvider, public storage: Storage) {
  }

  ionViewDidLoad() {
    this.loadNpEvents()
    console.log('ionViewDidLoad ManageEventsPage');
  }

  loadNpEvents(){
      this.GrabNpEventsProvider.load()
      .then(data => {
        this.npevents = data.data.event;
    });
  }

  removeEventFromDB(event_id) {
    this.GrabNpEventsProvider.deleteEvent(event_id);
  }
}
