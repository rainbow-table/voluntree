import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';
import { OAuthService } from '../oauth/oauth.service';
import { LoginPage } from '../login/login-page';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { ViewController, NavController, Platform, NavParams } from 'ionic-angular';
import { ProPubServiceProvider } from '../../providers/pro-pub-service/pro-pub-service';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import {GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarkerOptions} from 'ionic-native';
// import { GetNpAddressrProvider } from '../../providers/get-np-addressr/get-np-addressr';
import { GrabNpEventsProvider } from '../../providers/grab-np-events/grab-np-events';
import { NpCalProvider } from '../../providers/np-cal/np-cal';
import { ModalController } from 'ionic-angular';
import { EventSelectPage } from '../event-select/event-select';
import { Storage } from '@ionic/storage';
import { VolunteerMapSearchPage } from '../volunteer-map-search/volunteer-map-search';

/**
 * Generated class for the VolunteerDashPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//  declare var google: any;

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
  private map: GoogleMap;
  // map: GoogleMap;
  description: string; 
  edit: any;
  newDescription: string;
  public propublic: any;
  public npAddress: any;
  public npEvents = [];
  public finder: any;
  public results: any;
  public searched: boolean = false;

  // @ViewChild('map') mapElement: ElementRef;
  // map: any;
  // coords:any;

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
                query: `{volunteer (name: "${this.profile.firstName} ${this.profile.lastName}"){id description}}`
            }).map(data => {
              if (data.json().data.volunteer.length === 0) {
                this.http.post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
                    query: `mutation {volunteer(name: "${this.profile.firstName} ${this.profile.lastName}", description: "", profile_img: "${this.img}") {id name}}`
                }).map (data => {
                let voluntId = data.json().data.volunteer[0].id;
                this.storage.set('voluntId', voluntId);
                this.description = data.json().data.volunteer[0].description;
                }).toPromise();
              } else {
                let voluntId = data.json().data.volunteer[0].id;
                this.storage.set('voluntId', voluntId);
                this.description = data.json().data.volunteer[0].description;                
              }
            }).toPromise();
        })
    platform.ready().then(() => {
        // this.initializeMap();
            // this.loadMap();
        });

  
    // geolocation.getCurrentPosition().then((pos) => {
    //   this.coords = pos.coords;
    // }).catch((error) => {
    //   console.error('Error getting location', error);
    // });
    
    // this.loadProPublic();
  }

      goToVolunteerMapSearchPage(){
      this.navCtrl.push(VolunteerMapSearchPage);
    }

  logout() {
    this.navCtrl.push(LoginPage)
    .then(() => this.navCtrl.remove(this.viewCtrl.index))
  }  

  ionViewDidLoad() {
    // this.initializeMap();
    // this.loadMap();
    // this.loadProPublic();
    // this.loadNpEvents();
  }

  // initializeMap() {
 
  //   this.platform.ready().then(() => {
  //       var minZoomLevel = 12;
 
  //       // this.map = new google.maps.Map(document.getElementById('map_canvas'), {
  //       //     zoom: minZoomLevel,
  //       //     center: new google.maps.LatLng(38.50, -90.50),
  //       //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //       // });
  //   });
// } 

  // loadMap(){
  //   this.geolocation.getCurrentPosition().then((position) => {
  //     let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //     let mapOptions = {
  //       center: latLng,
  //       zoom: 12,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
  //     }
  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //   }, (err) => {
  //     console.error(err);
  //   });
  // }

  // addInfoWindow(marker, content){
  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });
   
    // google.maps.event.addListener(marker, 'click', () => {
    //   infoWindow.open(this.map, marker);
    // });
  // }

  // findAddressofNp(){
  //   this.GetNpAddressrProvider.load()
  //   .then(data => {
  //     this.npAddress = data;
  //     console.log(this.npAddress.address);
  //   });
  // }


  // ngAfterViewInit() {
    // GoogleMap.isAvailable().then(() => {

    //    this.geolocation.getCurrentPosition().then((position) => {
    //       //  let latLng = (position.coords.latitude, position.coords.longitude);

    //   this.map = new GoogleMap('map_canvas');

      // this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
      //   () => this.onMapReady(),
      //   () => alert("Error: onMapReady")
      // );

      // this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
      //   (data: any) => {
      //     alert("GoogleMap.onMapReady(): ");
      //   },
      //   () => alert("Error: GoogleMapsEvent.MAP_READY")
      // );

  //     this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
  //       alert("GoogleMap.onMapReady(): " + JSON.stringify(data));

  //       this._zone.run(() => {
  //         let myPosition = new GoogleMapsLatLng(position.coords.latitude, position.coords.longitude);
  //         console.log("My position is", myPosition);
  //         this.map.animateCamera({ target: myPosition, zoom: 10 });
  //       });

  //     });
  //   });
  //     }, (err) => {
  //     console.log(err);
  //   });

  // }

    // private onMapReady(): void {
    // alert('Map ready');
    //this.map.setOptions(mapConfig);
  // }

  // loadProPublic(){
  //   this.ProPubServiceProvider.load()
  //   .then(data => {
  //     this.propublic = data;
  //   });
  // }
  // loadNpEvents() {
  // this.GrabNpEventsProvider.load()
  // .then(data => {
  //   this.npEvents = data.data.event;
  // })
  // }
  // search() {
  //   this.searched = true;
  //   this.results = [];
  //   this.NpCalProvider.getCalEvents({query: `{event{
  //       id
  //       ngo_id
  //       description
  //       event_start
  //       event_end
  //       event_address
  //   }}`
  //   }).then(response => {
  //       response.event.map((value, i, array) => {
  //           if (this.finder.toLowerCase() === value.description.toLowerCase()) {
  //             this.results.push(value);
  //           }
  //           if (value.description.toLowerCase().includes(this.finder.toLowerCase())) {
  //             this.results.push(value);
  //           }
  //       });           
  //   });
  // }
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
  };
      // openModal(info) {
      //   let myModal = this.ModalController.create(EventSelectPage, info);
      //   myModal.present();
      // }
  
};
