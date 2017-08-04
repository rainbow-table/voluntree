import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import * as moment from 'moment';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { Storage } from '@ionic/storage';
import * as _ from 'underscore';
/**
 * Generated class for the EventSelectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-select',
  templateUrl: 'event-select.html',
})
export class EventSelectPage {
  public allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];  
  public description = this.navParams.get('description');
  public startTime = this.navParams.get('event_start');
  public startDay = this.navParams.get('event_start');
  public eventStartDay = new Date(this.startDay).getDate().toString();
  public eventStartMonth = this.allMonths[new Date(this.startDay).getMonth()].toString();
  public eventStartYear = new Date(this.startDay).getFullYear().toString();
  public start = moment(this.startTime).format('LLLL');
  public startHour;
  public endHour;
  public endTime = this.navParams.get('event_end');
  public end = moment(this.endTime).format('LLLL');
  public location = this.navParams.get('event_address');
  public eventId = this.navParams.get('id');
  constructor(public navCtrl: NavController, public navParams: NavParams, public ViewController: ViewController, public NpCalProvider: NpCalProvider, public storage: Storage, public AlertController: AlertController) {
  }
  public startRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public endRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public timeOfDay = ['AM', 'PM'];
  public allMinutes = ['00', '15', '30', '45'];
  public begin = '8';
  public finish = '9';
  public beginTimeOfDay = 'AM';
  public endTimeOfDay = 'AM';
  public startMinute = '00';
  public endMinute = '00';
  public id;
  public check;
  async ionViewDidLoad() {
    console.log('ionViewDidLoad EventSelectPage');
    this.id = await this.storage.get('voluntId')
    this.findStartHours(this.start);
    this.findEndHours(this.end);
    this.checkValid();
  }
  closeModal() {
    this.ViewController.dismiss();
  }
  volunteer() {
    let timeAlert = this.AlertController.create({
      title: 'Selection Error',
      message: 'You have selected an invalid start or end time.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('cancelled');
          }
        }
      ]
    });
    let archiveAlert = this.AlertController.create({
      title: 'Selection Error',
      message: 'You have selected an event that has already occured.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('cancelled');
          }
        }
      ]
    });
    let successAlert = this.AlertController.create({
      title: 'Success',
      message: 'You\'ve been signed up!',
      buttons: [
        {
          text: 'OK',
        }
      ]
    })
    let checkAlert = this.AlertController.create({
      title: 'Voluntree',
      message: 'You\'ve already signed up for this event.',
      buttons: [
        {
          text: 'OK',
        }
      ]
    })
    let volunteerStarting = `${this.eventStartMonth} ${this.eventStartDay} ${this.eventStartYear} ${this.begin.toString()}:${this.startMinute} ${this.beginTimeOfDay}`;
    let volunteerEnding = `${this.eventStartMonth} ${this.eventStartDay} ${this.eventStartYear} ${this.finish.toString()}:${this.endMinute} ${this.endTimeOfDay}`;
    let startCheck = new Date(volunteerStarting).getTime();
    let endCheck = new Date(volunteerEnding).getTime();
    if (startCheck >= endCheck) {
      timeAlert.present();
      return;
    }
    if  (startCheck < Date.now()) {
      archiveAlert.present();
      return;
    }
    let volunteerStart = new Date(volunteerStarting).toString();
    let volunteerEnd = new Date(volunteerEnding).toString();
    if (this.check.length) {
      checkAlert.present();
      return;
    }
    this.NpCalProvider.postCalEvent({query: `mutation{schedule(event_id: ${this.eventId}, volunteer_id: ${this.id}, volunteer_start: "${volunteerStart}", volunteer_end: "${volunteerEnd}"){id}}`}).then((data) => {successAlert.present()});
    this.closeModal();
  }
  findStartHours(time) {
    for (let i = 0; i < time.length; i++) {
      if (time[i] === ':') {
        let goodTime = time[i - 2] + time[i - 1];
        this.startHour = parseInt(goodTime, 10);
        return;
      }
    }
  }
  findEndHours(time) {
    for (let i = 0; i < time.length; i++) {
      if (time[i] === ':') {
        let goodTime = time[i - 2] + time[i - 1];
        this.endHour = parseInt(goodTime, 10);
        return;
      }
    }
  }
  checkValid() {
    this.NpCalProvider.getCalEvents({query: `{schedule(volunteer_id: ${this.id}, event_id: ${this.eventId}){volunteer_id}}`})
    .then(res => {this.check = res.schedule.map(val => val)});
    
  }

}
