import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, ModalController } from 'ionic-angular';
// import { CalendarComponent } from "../../components/calendar/calendar";
import { NgCalendarModule  } from 'ionic2-calendar';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';
import { OAuthService } from '../oauth/oauth.service';
import { LoginPage } from '../login/login-page';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { ManageEventsPage } from "../manage-events/manage-events";
import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { CreateEventPage } from '../create-event/create-event';
import { EinPage } from '../ein/ein';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the NpDashPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-np-dash',
  templateUrl: 'np-dash.html',
  providers: [ OAuthService, NpCalProvider ]
})
export class NpDashPage {
    private oauthService: OAuthService;
    profile: OAuthProfile;
    private http: Http;
    timeoutHandler: any; 
    description: string; 
    edit: any;
    newDescription: string;
  constructor(private viewCtrl: ViewController, http: Http, public navCtrl: NavController, public navParams: NavParams, public NgCalendarModule: NgCalendarModule, oauthService: OAuthService, public GrabNpEventsProvider: GrabNpEventsProvider, public NpCalProvider: NpCalProvider, public ModalController: ModalController, public storage: Storage) {
    this.http = http;
    this.oauthService = oauthService;
    this.edit = false;
    this.oauthService.getProfile()
    .then(profile => this.profile = profile)
  }

  public mouseup() {
    if (this.timeoutHandler) {
      clearInterval(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  public mousedown() {
    this.timeoutHandler = setInterval(() => {
      this.addEvent();
    }, 500);
  }  
  
  public npevents: any;
  public id;
  logout() {
    this.navCtrl.push(LoginPage)
    .then(() => this.navCtrl.remove(this.viewCtrl.index))
  }
  ionViewDidLoad() {
    this.oauthService.getProfile()
        .then(profile => this.profile = profile)
        .then(() => {
            this.http.post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
                query: `{ngo (name: "${this.profile.firstName} ${this.profile.lastName}"){id, description}}`
            }).map(data => {
                let id = data.json().data.ngo[0].id;
                this.id = data.json().data.ngo[0].id;
                this.storage.set('id', id);
                if (data.json().data.ngo.length === 0) {
                    this.navCtrl
                    .push(EinPage)
                    .then(() => this.navCtrl.remove(this.viewCtrl.index))
                } else {
                    this.description = data.json().data.ngo[0].description;
                    this.loadEvents();
                }
            }).map(() => {
            })
            .toPromise();
        })     
  }

    goToManageEventsPage(){
      this.navCtrl.push(ManageEventsPage);
    }

  eventSource;
    viewTitle;
    isToday: boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    }; // these are the variable used by the calendar.
    loadEvents() {
        this.NpCalProvider.getCalEvents({query: `{event(ngo_id: ${this.id}){
            id
            ngo_id
            description
            event_start
            event_end
            event_address
        }}`
        }).then(response => {
            this.eventSource = response.event.map((value, i, array) => {
                value.startTime = new Date(value.event_start);
                value.event_start = null;
                value.endTime = new Date(value.event_end);
                value.event_end = null;
                value.title = value.description;
                return value;
            });
        });
    }
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }
    onEventSelected(event) {
        // console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }
    changeMode(mode) {
        this.calendar.mode = mode;
    }
    today() {
        this.calendar.currentDate = new Date();
    }
    onTimeSelected(ev) {
        // console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            // (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    }
    onCurrentDateChanged(event:Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }
    onRangeChanged(ev) {
        // console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }
    markDisabled = (date:Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };

    addEvent() {
        let myModal = this.ModalController.create(CreateEventPage);
        myModal.onDidDismiss(() => {
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
        })
        myModal.present();
    }
    editDescription() {
      this.edit = !this.edit
    }
    submitDescription() {
        console.log(this.newDescription)
      this.http
        .post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
            query: `mutation {ngo (action: "update", name: "${this.profile.firstName} ${this.profile.lastName}", description: "${this.newDescription}") {description}}`
        })
        .map(data => {
            this.edit = !this.edit
            this.description = data.json().data.ngo.description
        })
        .map(() => {

        })
        .toPromise()
    }

}
