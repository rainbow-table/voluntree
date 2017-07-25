import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { ProPubServiceProvider } from '../../providers/pro-pub-service/pro-pub-service';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
// import { GetNpAddressrProvider } from '../../providers/get-np-addressr/get-np-addressr';


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
  providers: [ ProPubServiceProvider, Geolocation]
})
export class VolunteerDashPage {
  map: GoogleMap;

  public propublic: any;
  public npAddress: any;

  @ViewChild('map') mapElement: ElementRef;
  // map: any;
  coords:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ProPubServiceProvider: ProPubServiceProvider, private geolocation: Geolocation, public platform: Platform, private googleMaps: GoogleMaps) {
        
      platform.ready().then(() => {
            this.loadMap();
        });
    
    geolocation.getCurrentPosition().then((pos) => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      this.coords = pos.coords;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
    this.loadProPublic();
    // this.findAddressofNp();
  }

  ionViewDidLoad() {
    
    // this.loadMap();
    this.loadProPublic();
    console.log('ionViewDidLoad VolunteerDashPage');
  }

// loadMap(){
 
//     this.geolocation.getCurrentPosition().then((position) => {
 
//       let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
//       let mapOptions = {
//       center: latLng,
//       zoom: 12,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     }
 
//       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
//     }, (err) => {
//       console.log(err);
//     });
 
//   }

loadMap() {
  this.map = new GoogleMap('map');

  this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
    console.log('Map is ready!');
  });
}

  addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
 
}

  // findAddressofNp(){
  //   this.GetNpAddressrProvider.load()
  //   .then(data => {
  //     this.npAddress = data;
  //     console.log(this.npAddress.address);
  //   });
  // }

  loadProPublic(){
    this.ProPubServiceProvider.load()
    .then(data => {
      this.propublic = data;
    });
  }
}

