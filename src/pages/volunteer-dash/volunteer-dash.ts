import { Component, ViewChild, ElementRef } from '@angular/core';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';
import { OAuthService } from '../oauth/oauth.service';
import { LoginPage } from '../login/login-page';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { ViewController, NavController, Platform, NavParams } from 'ionic-angular';
import { ProPubServiceProvider } from '../../providers/pro-pub-service/pro-pub-service';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng } from 'ionic-native';
// import { GetNpAddressrProvider } from '../../providers/get-np-addressr/get-np-addressr';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { NpCalProvider } from '../../providers/np-cal/np-cal';

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
  providers: [ OAuthService, ProPubServiceProvider, Geolocation, GrabNpEventsProvider, NpCalProvider]
})
export class VolunteerDashPage {
  private oauthService: OAuthService;
  profile: OAuthProfile;
  private http: Http;
  img: string;
  map: GoogleMap;

  public propublic: any;
  public npAddress: any;
  public npEvents: any;
  public finder: any;
  public results: any;
  public searched: boolean = false;

  @ViewChild('map') mapElement: ElementRef;
  // map: any;
  coords:any;

  constructor(private viewCtrl: ViewController, private geolocation: Geolocation, http: Http, public navCtrl: NavController, public navParams: NavParams, oauthService: OAuthService, public ProPubServiceProvider: ProPubServiceProvider, public platform: Platform, public GrabNpEventsProvider: GrabNpEventsProvider, public NpCalProvider: NpCalProvider) {
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
      this.coords = pos.coords;
    }).catch((error) => {
      console.error('Error getting location', error);
    });
    
    this.loadProPublic();
  }

  logout() {
    this.navCtrl.push(LoginPage)
    .then(() => this.navCtrl.remove(this.viewCtrl.index))
  }  

  ionViewDidLoad() {
    this.loadMap();
    // this.loadProPublic();
    this.loadNpEvents();
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
      console.error(err);
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
  loadNpEvents() {
  this.GrabNpEventsProvider.load()
  .then(data => {
    this.npEvents = data.data.event;
  })
  }
  search() {
    this.searched = true;
    this.results = [];
    this.NpCalProvider.getCalEvents({query: `{event{
            id
            ngo_id
            description
            event_start
            event_end
            event_address
        }}`
        }).then(response => {
            response.event.map((value, i, array) => {
                if (this.finder.toLowerCase() === value.description.toLowerCase()) {
                  this.results.push(value);
                }
                if (value.description.toLowerCase().includes(this.finder.toLowerCase())) {
                  this.results.push(value);
                }
            });           
        });

  }
}



