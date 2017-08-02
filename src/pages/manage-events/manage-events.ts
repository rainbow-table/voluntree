import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Http } from '@angular/http';
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
  pastEvents: any;
  private http: Http;

  constructor(http: Http, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public GrabNpEventsProvider: GrabNpEventsProvider, public NpCalProvider: NpCalProvider, public storage: Storage) {
    this.http = http; 
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
          this.npevents = []; 
          this.pastEvents = [];
          let now = new Date();
          response.event.forEach(event => {
            if (new Date(event.event_end) > now) {
              this.npevents.push(event)
            } else {
              this.pastEvents.push(event)
            }
          })
        });

  }

  removeEventFromDB(event_id) {
    console.log()
    this.GrabNpEventsProvider.deleteEvent(event_id);
  }

  showVolunteers(event_id, index, past) {
    if ((!this.npevents[index].vol && !past) || (!this.pastEvents[index].vol && past)) {
      this.GrabNpEventsProvider.grabVolunteers(event_id)
        .then(dat => {
          let data: any = (dat as any).json()
          past === true ? this.pastEvents[index].vol = [] : this.npevents[index].vol = [];
          data.data.schedule.forEach(obj => {
            let volunteer = obj.volunteer_id;
            let id = obj.id;
            let start = moment(obj.volunteer_start).format('LLLL');
            let end = moment(obj.volunteer_end).format('LLLL');
            this.GrabNpEventsProvider.grabVolunteer(volunteer)
              .then(dat => {
                let data: any = (dat as any).json();
                let img = data.data.volunteer[0].profile_img;
                let name = data.data.volunteer[0].name
                let description = data.data.volunteer[0].description;
                if (past === true) {
                  console.log('...........................true')
                  this.pastEvents[index].vol.push({volunteer_id: volunteer, volunteer: name, id: id, start: start, end: end, img: img, description: description, event_id: event_id})
                  console.log(this.pastEvents[index].vol.length)
                } else {
                  this.npevents[index].vol.push({volunteer_id: volunteer, volunteer: name, id: id, start: start, end: end, img: img, description: description, event_id: event_id})
                }
              })
          })
        })
      } else {
        if (past === true) {
          this.pastEvents[index].vol = null;
        } else {
          this.npevents[index].vol = null;
        }
      }
  }

  removeVolunteer(vol, event_id, index) {
    let alert = this.alertCtrl.create({
    title: 'Remove Volunteer',
    message: 'Really remove this volunteer?',
    buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('canceled removing volunteer')
          }
        },
        {
          text: 'Remove',
          handler: () => {
            console.log('...................................')
            console.log(this.id)
            console.log(vol.volunteer_id)
            console.log(vol.event_id)
            this.GrabNpEventsProvider.addEventRemoved(this.id, vol.volunteer_id, vol.event_id)
              .then(() => {
                this.GrabNpEventsProvider.deleteSchedule(vol.id)
              })
              .then(() => {
                this.showVolunteers(event_id, index, false)
              })
          }
        }
    ]
    });
    alert.present();
  }

}

