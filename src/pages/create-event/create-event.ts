import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public ViewController: ViewController, public NpCalProvider: NpCalProvider) {
  }
  public event = {
    description: "",
    start: "",
    end: "",
    location: ""
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }
    closeModal() {
      this.ViewController.dismiss();
    }
    
    postNewEvent() {
      console.log(this.event.description)
      this.NpCalProvider.postCalEvent({})
      this.closeModal();
    }

}
