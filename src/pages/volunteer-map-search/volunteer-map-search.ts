import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';
import { OAuthService } from '../oauth/oauth.service';
import { LoginPage } from '../login/login-page';
import { Http } from '@angular/http';
import { Geocoder, GeocoderRequest } from 'ionic-native';
import 'rxjs/Rx';
import { ViewController, NavController, Platform, NavParams } from 'ionic-angular';
import { ProPubServiceProvider } from '../../providers/pro-pub-service/pro-pub-service';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import {GoogleMap, GoogleMapsMarker, GoogleMapsEvent, CameraPosition, GoogleMapsLatLng, GoogleMapsMarkerOptions} from 'ionic-native';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { ModalController } from 'ionic-angular';
import { EventSelectPage } from '../event-select/event-select';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

/**
* Generated class for the VolunteerMapSearchPage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/

@Component({
  selector: 'page-volunteer-map-search',
  templateUrl: 'volunteer-map-search.html',
  providers: [ OAuthService, ProPubServiceProvider, Geolocation, GrabNpEventsProvider, NpCalProvider]
})
export class VolunteerMapSearchPage {
  private oauthService: OAuthService;
  profile: OAuthProfile;
  private http: Http;
  img: string;
  private map: GoogleMap;
  description: string; 
  edit: any;
  newDescription: string;
  public propublic: any;
  public npAddress: any;
  public npEvents = [];
  public finder: any;
  public results: any;
  public searched: boolean = false;
  public geoAddress = [];


  constructor(private _zone: NgZone, private viewCtrl: ViewController, private geolocation: Geolocation, http: Http, public navCtrl: NavController, public navParams: NavParams, oauthService: OAuthService, public ProPubServiceProvider: ProPubServiceProvider, public platform: Platform, public GrabNpEventsProvider: GrabNpEventsProvider, public NpCalProvider: NpCalProvider, public ModalController: ModalController, public storage: Storage) {
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
                }).map (data => {                
                let voluntId = data.json().data.volunteer[0].id;
                this.storage.set('voluntId', voluntId);

                }).toPromise();
              } else {
                let voluntId = data.json().data.volunteer[0].id;
                this.storage.set('voluntId', voluntId);
              }
            }).toPromise();
        })
    platform.ready().then(() => {
       this.loadProPublic();

     
        });

    
  

      let req: GeocoderRequest = {
  address: '1364 Camp St.'
  // `${this.NpCalProvider.getCalEvents({query: `{event{event_address}}`})}`
};
Geocoder.geocode(req).then(((results)=>{ 
     this.map.clear();
  if (results.length) {
    var result = results[0];
    var position = result.position;
    // console.log(position);
  
    this.map.addMarker({
      'position': new GoogleMapsLatLng(position.lat, position.lng),
      'title':  JSON.stringify(result.position)
    }).then((marker: GoogleMapsMarker) => {
        this.map.animateCamera({
        'target': position,
        'zoom': 17
      
      }).then(() =>  {
        marker.showInfoWindow();
      });

    });
  } else {
    alert("Not found");
    console.log(results);
  }
}))



  }

  

  logout() {
    this.navCtrl.push(LoginPage)
    .then(() => this.navCtrl.remove(this.viewCtrl.index))
  }  

  ionViewDidLoad() {
    this.loadProPublic();
    this.loadNpEvents();
  }

  ngAfterViewInit() {
    GoogleMap.isAvailable().then(() => {
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = [position.coords.latitude, position.coords.longitude];
        this.map = new GoogleMap('map_canvas');
        this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
          this._zone.run(() => {
            let myPosition = new GoogleMapsLatLng(latLng[0], latLng[1]);
            this.map.animateCamera({ target: myPosition, zoom: 10 });
            let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(latLng[0], latLng[1]);
            // create CameraPosition
            let position: CameraPosition = {
              target: ionic,
              zoom: 18,
              tilt: 30
            };
            // move the map's camera to position
            this.map.moveCamera(position);
            // create new marker
            let markerOptions: GoogleMapsMarkerOptions = {
              position: ionic,
              title: 'You are here'
            };
            this.map.addMarker(markerOptions)
              .then((marker: GoogleMapsMarker) => {
                marker.showInfoWindow();
            });
            this.map.one(GoogleMapsEvent.MARKER_CLICK).then(() => {
              // do something with marker
            });
          });
        });
        });
      }, (err) => {
      console.log(err);
    });
  };
  private onMapReady(): void {

  };

  //   getMarkers() {
  //   this.http.get('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql?query={event{event_address}}')
  //   .map((res) => res.json())
  //   .subscribe(data => {
  //     this.addMarkersToMap(data);
  //   });
  // }

  //  addMarkersToMap(markers) {
  //   for(let marker of markers) {
  //     var position = new GoogleMapsLatLng(marker.latitude, marker.longitude);
  //    var eventMarker = new GoogleMap({position: position, title: marker.title});
  //     eventMarker.setMap(this.map);
  //   }
  // }



  loadProPublic(){
    this.ProPubServiceProvider.load()
    .then(data => {
      this.propublic = data;
    });
  }
  loadNpEvents() {
  this.NpCalProvider.getCalEvents({query: `{event{
        id
        ngo_id
        description
        event_start
        event_end
        event_address
    }}`
    })
  .then(response => {
    response.event.map(async (value, i, array) => {
      value.start = moment(value.event_start).format('LLLL');
      value.end = moment(value.event_end).format('LLLL');
      value.ngo = await this.loadNgos(value.ngo_id);
      let now = new Date();
      if (new Date(value.event_start) > now) {
        this.npEvents.push(value);
      }
    })
  })
  };
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
        response.event.map(async (value, i, array) => {
          value.start = moment(value.event_start).format('LLLL');
          value.end = moment(value.event_end).format('LLLL');
          value.ngo = await this.loadNgos(value.ngo_id);
            if (this.finder.toLowerCase() === value.description.toLowerCase()) {
              this.results.push(value);
            };
            if (value.description.toLowerCase().includes(this.finder.toLowerCase())) {
              this.results.push(value);
            };
            if (value.event_address.toLowerCase().includes(this.finder.toLowerCase())) {
              this.results.push(value);
            }
        });           
    });
  };
  editDescription() {
    this.edit = !this.edit
  }
  submitDescription() {
    this.http
      .post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
          query: `mutation {volunteer (action: "update", name: "${this.profile.firstName} ${this.profile.lastName}", description: "${this.newDescription}") {description}}`
      })
      .map(data => {
          this.edit = !this.edit
          this.description = data.json().data.volunteer.description
      })
      .map(() => {

      })
      .toPromise()
  }
      openModal(info) {
        let myModal = this.ModalController.create(EventSelectPage, info);
        myModal.onDidDismiss(() => {
          this.results = [];
          this.finder = '';
          // this.navCtrl.setRoot(this.navCtrl.getActive().component);
        })
        myModal.present();
      };
      loadNgos(id) {
      return this.NpCalProvider.getCalEvents({query: `{ngo(id: ${id}){
            username
          }}`}).then(data => {
            return data.ngo[0];
          });
    }
};