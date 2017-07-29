import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
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
  providers: [NpCalProvider]
})
export class ManageEventsPage {
  npevents: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public GrabNpEventsProvider: GrabNpEventsProvider, public NpCalProvider: NpCalProvider, public storage: Storage) {
  }
  public id;
  async ionViewDidLoad() {
    this.id = await this.storage.get('id');    
    this.loadNpEvents()
    console.log('ionViewDidLoad ManageEventsPage');
  }

  loadNpEvents(){
      this.NpCalProvider.getCalEvents({query: `{event(ngo_id: ${this.id}){
            id
            ngo_id
            description
            event_start
            event_end
            event_address
        }}`
        }).then(response => {
          this.npevents = response.event;           
        });

  }

  removeEventFromDB(event_id) {
    this.GrabNpEventsProvider.deleteEvent(event_id);
  }
}
