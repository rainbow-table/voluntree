import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProPubServiceProvider } from '../../providers/pro-pub-service/pro-pub-service';
import { NpDashPage } from '../np-dash/np-dash';
import { OAuthService } from '../oauth/oauth.service';
import { Http } from '@angular/http';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';
import 'rxjs/Rx';
/**
 * Generated class for the EinPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-ein',
  templateUrl: 'ein.html',
  providers: [ProPubServiceProvider, OAuthService]
})
export class EinPage {
  private oauthService: OAuthService;
  private propub: ProPubServiceProvider;
  profile: OAuthProfile;
  private verified;
  private propubdata;
  http: Http
  constructor(http: Http, oauthService: OAuthService, public navCtrl: NavController, public navParams: NavParams, propub: ProPubServiceProvider) {
    this.propub = propub;
    this.oauthService = oauthService;
    this.profile;
    this.http = http
    this.verified = false;
    this.propubdata;
  }

  ionViewDidLoad() {
    this.oauthService.getProfile()
    .then(profile => {
      this.profile = profile
    })
  }

  verify() {
      this.propub.findSingle(this.ein)
      .then((data):any => {
        if ((data as any).status === 404) {
          this.verified = false;
          this.ein = 'invalid';
          console.error('not valid');
          return 'not valid';
        }
        this.verified = true;
        this.propubdata = data;
       })
  }
  submit() {
    let address = `${(this.propubdata as any).organization.address}, ${(this.propubdata as any).organization.city}, ${(this.propubdata as any).organization.state}, ${(this.propubdata as any).organization.zipcode}`
    return this.http.post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
      query: `mutation {ngo(name: "${this.profile.firstName} ${this.profile.lastName}", description: "", ngo_address: "${address}", ein: ${(this.propubdata as any).organization.ein} email: "${this.profile.email}", profile_img: "${this.profile.photo.data.url}") {id}}`
    })
    .subscribe(data => {
      this.navCtrl.push(NpDashPage)
    })

  }

  public ein = '';

}