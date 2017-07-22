import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CreateEventPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public ViewController: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }
    closeModal() {
      this.ViewController.dismiss();
    }

}
