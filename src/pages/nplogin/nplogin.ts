import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OAuthService } from '../oauth/oauth.service';
import { NpDashPage } from '../np-dash/np-dash';
import { Http } from '@angular/http';
/**
 * Generated class for the NploginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-nplogin',
  templateUrl: 'nplogin.html',
  providers: [OAuthService]
})
export class NploginPage {
	private oauthService: OAuthService;
	private nav: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams, oauthService: OAuthService, nav: NavController) {
  	this.oauthService = oauthService;
	this.nav = nav;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NploginPage');
  }
	public login(source: string) {
		this.oauthService.login(source)
			.then(
				() => this.nav.setRoot(NpDashPage),
				error => alert(error)
			);
	}  

}
