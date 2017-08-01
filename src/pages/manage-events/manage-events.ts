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
    console.log()
    this.GrabNpEventsProvider.deleteEvent(event_id);
  }

  showVolunteers(event_id, index) {
    if (!this.npevents[index].vol) {
      this.GrabNpEventsProvider.grabVolunteers(event_id)
        .then(dat => {
          let data: any = (dat as any).json()
          this.npevents[index].vol = [];
          data.data.schedule.forEach(obj => {
            let volunteer = obj.volunteer_id;
            let id = obj.id;
            let start = obj.volunteer_start;
            let end = obj.volunteer_end;
            this.GrabNpEventsProvider.grabVolunteer(volunteer)
              .then(dat => {
                let data: any = (dat as any).json();
                console.log(data.data)
                console.log(data.data.volunteer)
                console.log(data.data.volunteer[0])
                let img = data.data.volunteer[0].profile_img;
                let name = data.data.volunteer[0].name
                let description = data.data.volunteer[0].description;
                this.npevents[index].vol.push({volunteer: name, id: id, start: start, end: end, img: img, description: description})
              })
          })
        })
      } else {
        this.npevents[index].vol = null;
      }
  }
}
