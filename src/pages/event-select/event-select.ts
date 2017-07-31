import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import { NpCalProvider } from '../../providers/np-cal/np-cal';

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
  public description = this.navParams.get('description');
  public startTime = this.navParams.get('event_start');
  public start = moment(this.startTime).format('LLLL');
  public endTime = this.navParams.get('event_end');
  public end = moment(this.endTime).format('LLLL');
  public location = this.navParams.get('event_address');
  constructor(public navCtrl: NavController, public navParams: NavParams, public ViewController: ViewController, public NpCalProvider: NpCalProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventSelectPage');
  }
  closeModal() {
    this.ViewController.dismiss();
  }
  volunteer() {
    alert('I volunteer');
    this.NpCalProvider.postCalEvent({query: `mutation:{}`});
  }

}
