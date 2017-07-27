import { Component } from '@angular/core';

/**
 * Generated class for the CalendarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {
  today
  text: string;

  

  constructor() {
    this.text = 'Hello World';
    this.today = new Date().toISOString();
  }

}
