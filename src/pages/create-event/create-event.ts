import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { NpDashPage } from '../np-dash/np-dash';
import { Storage } from '@ionic/storage';
import { AutocompletePage } from '../autocomplete/autocomplete';

// import * as moment from 'moment';
/**
 * Generated class for the CreateEventPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
  providers: [NpCalProvider]
})
export class CreateEventPage {

  constructor(private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public ViewController: ViewController, public NpCalProvider: NpCalProvider, public storage: Storage, public AlertController: AlertController) {
    this.address = {
      place: ''
    };
  }
  public address;
  public date;
  public allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  public allStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
  public event = {
    description: '',

    start: {
      month: this.allMonths[new Date(this.date).getMonth()],
      day: new Date(this.date).getDate().toString(),
      year: new Date(this.date).getFullYear(),
      hour: '8',
      minute: '00',
      timeOfDay: 'AM'
    },
    end: {
      // month: this.allMonths[new Date().getMonth()],
      // day: new Date().getDate().toString(),
      // year: new Date().getFullYear(),
      hour: '9',
      minute: '00',
      timeOfDay: 'AM'
    },
    location: ''
    
  }
  public month = this.allMonths[new Date().getMonth().toString()];
  public allDays = [];
  public day = new Date().getDay();
  public allYears = [];
  public year = new Date().getFullYear();
  public allHours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  public hour;
  public allMinutes = ['00', '15', '30', '45'];
  public timesOfDay=['AM', 'PM']
  public streetAddress;
  public city;
  public state;
  public zipCode;
  public grabber;
  public id;

  

async ionViewDidLoad() {
    this.getDays();
    this.getYears();
  this.id = await this.storage.get('id');
  this.date = await this.storage.get('selected')
  this.address.place = await this.storage.get('address')
  this.event.start.month = this.allMonths[new Date(this.date).getMonth()]
  this.event.start.day = new Date(this.date).getDate().toString()
  this.event.start.year = new Date(this.date).getFullYear()
  }

  showAddressModal() {
    console.log('hit')
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      me.address.place = data;
    });
    modal.present();
    console.log('hit again')
  }

  getDays() {
    this.allDays = [];
    for (let i = 1; i < 32; i++) {
      if (this.month === 'February' && i === 29) {
        if (this.year % 4 === 0) {
          this.allDays.push(i.toString());
          return;
        } else {
          return;
        }
      } else if (this.month === 'April' || this.month === 'June' || this.month === 'September' || this.month === 'November') {
        if (i === 31) {
          return;
        } else {
          this.allDays.push(i.toString());
        }
      } else {
        this.allDays.push(i.toString());
      }
    }
  }
  
  getYears() {
    for (let j = this.year; j < this.year + 10; j++) {
      this.allYears.push(j);
    }
  }
    closeModal() {
      this.ViewController.dismiss();
    }
    
    postNewEvent() {
      let cityAlert = this.AlertController.create({
        title: 'City Required',
        message: 'Your event is nowhere. Please add a place.',
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
      let overAlert = this.AlertController.create({
        title: 'Invalid Event Times',
        message: 'Your event is over before it begins. Please select a different start or end time.',
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
      let elapsedAlert = this.AlertController.create({
        title: 'Invalid Event',
        message: 'There\'s no going back. Please select a different start time.',
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
      let nameAlert = this.AlertController.create({
        title: 'Event Name Require',
        message: 'Your event has no name. Please add one.',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {

            }
          }
        ]
      });
      if (!this.id) {
        return;
      }
      if (this.address.place < 0) {
        cityAlert.present();
        return;
      }
      this.event.location = this.address.place;
      let myStartMonth = (this.allMonths.indexOf(this.event.start.month) + 1).toString();
      if (myStartMonth.length < 2) {
        myStartMonth = '0' + myStartMonth;
      }
      let startInfo = this.event.start.year.toString() +'/' + myStartMonth + '/' + this.event.start.day + " " + (this.event.start.hour + ":" + this.event.start.minute + " " + this.event.start.timeOfDay);
      let endInfo = this.event.start.year.toString() +'/' + myStartMonth + '/' + this.event.start.day + " " + (this.event.end.hour + ":" + this.event.end.minute + " " + this.event.end.timeOfDay);
      let startDate = new Date(startInfo);
      let endDate = new Date(endInfo);
      if (endDate.getTime() <= startDate.getTime()) {
        overAlert.present();
        return;
      }
      if (startDate.getTime() < Date.now()) {
        elapsedAlert.present();
        return;
      }
      let start = startDate.toString();
      let end = endDate.toString();
      let description = this.event.description;
      if (description.length < 1) {
        nameAlert.present();
        return;
      }
      let location = this.event.location;
      console.log(start)
      console.log(end)
      console.log(description)
      console.log(location)
      console.log(this.id)
      this.NpCalProvider.postCalEvent({query: `mutation{event(event_start: "${start}", event_end: "${end}", description: "${description}", event_address: "${location}", ngo_id: ${this.id}){
        event_start
        event_end
        description
        event_address
        ngo_id
        id
      }}`}).then(()=> {})
      .catch(err => console.error(err));
      this.closeModal();
    }

}
