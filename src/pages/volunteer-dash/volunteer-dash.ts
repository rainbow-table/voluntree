import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VolunteerDashPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 declare var google: any;

@Component({
  selector: 'page-volunteer-dash',
  templateUrl: 'volunteer-dash.html',
})
export class VolunteerDashPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.loadMap();
    console.log('ionViewDidLoad VolunteerDashPage');
  }

  loadMap(){
 
    let latLng = new google.maps.LatLng(29.9459, -90.0700);
 
    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }
}


