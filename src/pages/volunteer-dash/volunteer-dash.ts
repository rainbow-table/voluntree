import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';
import { OAuthService } from '../oauth/oauth.service';
import { LoginPage } from '../login/login-page';
import { Http } from '@angular/http';
import 'rxjs/Rx';

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
  providers: [OAuthService],
})
export class VolunteerDashPage {
  private oauthService: OAuthService;
  profile: OAuthProfile;
  private http: Http;
  img: string;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(http: Http, public navCtrl: NavController, public navParams: NavParams, oauthService: OAuthService) {
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
  }

  logout() {
    this.navCtrl.push(LoginPage)
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


