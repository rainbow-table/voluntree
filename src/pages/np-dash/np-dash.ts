import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
// import { CalendarComponent } from "../../components/calendar/calendar";
import { NgCalendarModule  } from 'ionic2-calendar';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { ManageEventsPage } from "../manage-events/manage-events";

import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { CreateEventPage } from '../create-event/create-event';


/**
 * Generated class for the NpDashPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-np-dash',
  templateUrl: 'np-dash.html',
  providers: [NpCalProvider]
})
export class NpDashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public NgCalendarModule: NgCalendarModule, public GrabNpEventsProvider: GrabNpEventsProvider, public NpCalProvider: NpCalProvider, public ModalController: ModalController) {
  }
  
  public npevents: any;

  ionViewDidLoad() {
    this.loadNpEvents();
    this.loadEvents();
    
    console.log('ionViewDidLoad NpDashPage');
  }

    goToManageEventsPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
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
        this.NpCalProvider.getCalEvents({query: `{event{
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
                console.log(value, 'im the value');
                return value;
            });
            console.log(this.eventSource);            
        });
    }
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }
    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }
    changeMode(mode) {
        this.calendar.mode = mode;
    }
    today() {
        this.calendar.currentDate = new Date();
    }
    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    }
    onCurrentDateChanged(event:Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }
    // createRandomEvents() {
    //     var events = [];
    //     for (var i = 0; i < 50; i += 1) {
    //         var date = new Date();
    //         var eventType = Math.floor(Math.random() * 2);
    //         var startDay = Math.floor(Math.random() * 90) - 45;
    //         var endDay = Math.floor(Math.random() * 2) + startDay;
    //         var startTime;
    //         var endTime;
    //         if (eventType === 0) {
    //             startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
    //             if (endDay === startDay) {
    //                 endDay += 1;
    //             }
    //             endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
    //             events.push({
    //                 title: 'All Day - ' + i,
    //                 startTime: startTime,
    //                 endTime: endTime,
    //                 allDay: true
    //             });
    //         } else {
    //             var startMinute = Math.floor(Math.random() * 24 * 60);
    //             var endMinute = Math.floor(Math.random() * 180) + startMinute;
    //             startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
    //             endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
    //             events.push({
    //                 title: 'Event - ' + i,
    //                 startTime: startTime,
    //                 endTime: endTime,
    //                 allDay: false
    //             });
    //         }
    //     }
    //     return events;
    // }
    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }
    markDisabled = (date:Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };

    loadNpEvents(){
      this.GrabNpEventsProvider.load()
			.then(data => {
					this.npevents = data.data.event;
					console.log(this.npevents);
			});
    }

    addEvent() {
			let myModal = this.ModalController.create(CreateEventPage);
			myModal.present();
    }

}
