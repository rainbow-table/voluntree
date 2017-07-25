import { Component, ViewChild, ElementRef } from '@angular/core';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';
import { OAuthService } from '../oauth/oauth.service';
import { LoginPage } from '../login/login-page';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { ProPubServiceProvider } from '../../providers/pro-pub-service/pro-pub-service';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng } from 'ionic-native';
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
  providers: [ OAuthService, ProPubServiceProvider, Geolocation]
})
export class VolunteerDashPage {
  private oauthService: OAuthService;
  profile: OAuthProfile;
  private http: Http;
  img: string;
  map: GoogleMap;

  public propublic: any;
  public npAddress: any;

  @ViewChild('map') mapElement: ElementRef;
  // map: any;
  coords:any;

  constructor(private geolocation: Geolocation, http: Http, public navCtrl: NavController, public navParams: NavParams, oauthService: OAuthService, public ProPubServiceProvider: ProPubServiceProvider, public platform: Platform) {
    this.oauthService = oauthService;
    this.http = http;    
    oauthService.getProfile()
        .then(profile => {
          this.profile = profile
          this.img = profile.photo.data.url
        })
        .then(() => {
            this.http.post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
                query: `{volunteer (name: "${this.profile.firstName} ${this.profile.lastName}"){id}}`
            }).map(data => {
              if (data.json().data.volunteer.length === 0) {
                this.http.post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
                    query: `mutation {volunteer(name: "${this.profile.firstName} ${this.profile.lastName}", description: "", profile_img: "${this.img}") {id name}}`
                }).toPromise();
              }
            }).toPromise();
        })
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
  }

  logout() {
    this.navCtrl.push(LoginPage)
  }  

  ionViewDidLoad() {
    
    this.loadMap();
    this.loadProPublic();
    console.log('ionViewDidLoad VolunteerDashPage');
  }

loadMap(){
 
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
    }, (err) => {
      console.log(err);
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


