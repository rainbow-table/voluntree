import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProPubServiceProvider } from '../../providers/pro-pub-service/pro-pub-service';

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
  providers: [ ProPubServiceProvider ]
})
export class VolunteerDashPage {

  public propublic: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ProPubServiceProvider: ProPubServiceProvider) {
    this.loadProPublic();
  }

  ionViewDidLoad() {
    this.loadMap();
    this.loadProPublic();
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

  loadProPublic(){
  this.ProPubServiceProvider.load()
  .then(data => {
    this.propublic = data;
  });
}
}


