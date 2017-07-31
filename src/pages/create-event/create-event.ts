import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { NpDashPage } from '../np-dash/np-dash';
import { Storage } from '@ionic/storage';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public ViewController: ViewController, public NpCalProvider: NpCalProvider, public storage: Storage) {
  }
  public allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  public allStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
  public event = {
    description: '',
    start: {
      month: this.allMonths[new Date().getMonth()],
      day: new Date().getDate().toString(),
      year: new Date().getFullYear(),
      hour: '8',
      minute: '00',
      timeOfDay: 'AM'
    },
    end: {
      month: this.allMonths[new Date().getMonth()],
      day: new Date().getDate().toString(),
      year: new Date().getFullYear(),
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
      if (!this.id) {
        alert('there is no id. try again.');
        return;
      } else {
        // alert(`this is id: ${this.id}`);
      }
      if (this.streetAddress.length < 0) {
        alert('Your event is nowhere. Please add a street address.');
        return;
      }
      if (this.city.length < 0) {
        alert('Your event is nowhere. Please add a city.');
        return;
      }
      if (this.zipCode.length < 5) {
        alert('Your zipcode is invalid. Please enter a valid zipcode.');
        return;
      }
      if (this.state.length < 2) {
        alert('Please select a state.');
        return;
      }
      this.event.location = this.streetAddress + " " + this.city + ', ' + this.state + " " + this.zipCode;
      let myStartMonth = (this.allMonths.indexOf(this.event.start.month) + 1).toString();
      if (myStartMonth.length < 2) {
        myStartMonth = '0' + myStartMonth;
      }
      let myEndMonth = (this.allMonths.indexOf(this.event.end.month) + 1).toString();
      if (myEndMonth.length < 2) {
        myEndMonth = '0' + myEndMonth;
      }
      let startInfo = this.event.start.year.toString() +'/' + myStartMonth + '/' + this.event.start.day + " " + (this.event.start.hour + ":" + this.event.start.minute + " " + this.event.start.timeOfDay);
      let endInfo = this.event.end.year.toString() +'/' + myEndMonth + '/' + this.event.end.day + " " + (this.event.end.hour + ":" + this.event.end.minute + " " + this.event.end.timeOfDay);
      let startDate = new Date(startInfo);
      let endDate = new Date(endInfo);
      if (endDate.getTime() < startDate.getTime()) {
        alert('Your event is over before it begins. Please select a different start or end time.');
        return;
      }
      if (startDate.getTime() < Date.now()) {
        alert('There\'s no going back. Please select a different start time.')
        return;
      }
      let start = startDate.toString();
      let end = endDate.toString();
      let description = this.event.description;
      if (description.length < 1) {
        alert('Your event has no name. Please add one.');
        return;
      }
      let location = this.event.location;
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
