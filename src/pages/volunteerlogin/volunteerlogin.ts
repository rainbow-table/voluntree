import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OAuthService } from '../oauth/oauth.service';
import { VolunteerDashPage } from '../volunteer-dash/volunteer-dash';
import { Http } from '@angular/http';

/**
 * Generated class for the VolunteerloginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-volunteerlogin',
  templateUrl: 'volunteerlogin.html',
  providers: [OAuthService]
})
export class VolunteerloginPage {
	private oauthService: OAuthService;
	private nav: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams, oauthService: OAuthService, nav: NavController) {
	this.oauthService = oauthService;
	this.nav = nav;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VolunteerloginPage');
  }

	public login(source: string) {
		this.oauthService.login(source)
			.then(
				() => this.nav.setRoot(VolunteerDashPage),
				error => alert(error)
			);
	}
}