import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { IOathProvider } from './oauth.provider.interface';
import { OAuthProfile } from './models/oauth-profile.model';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova'
import { Facebook } from 'ng2-cordova-oauth/provider/facebook';
import { Config } from './../../config';
import 'rxjs/Rx';

interface ILoginResponse {
	access_token: string;
}

interface IProfileResponse {
	first_name: string;
	last_name: string;
	email: string;
	picture: object;
}

@Injectable()
export class FacebookOauthProvider implements IOathProvider {
	private cordovaOauth: OauthCordova;
	private http: Http;
	private config: Config;
	private facebook: Facebook;

	constructor(http: Http, config: Config) {
		this.http = http;
		this.config = config;
		this.facebook = new Facebook({ clientId: config.facebook.appId, appScope: config.facebook.scope });
		this.cordovaOauth = new OauthCordova();
	}

	login(): Promise<string> {
		return this.cordovaOauth.login(this.facebook)
			.then((x: ILoginResponse) => x.access_token);
	}

	getProfile(accessToken): Promise<OAuthProfile> {
		let query = `fields=id,picture,first_name,last_name,email&access_token=${accessToken}&format=json`;
		let url = `${this.config.facebook.apiUrl}me?${query}`;
		return this.http.get(url)
			.map(x => <IProfileResponse>x.json())
			.map((x: IProfileResponse) => {
				// let photo = x.picture.data.url
				let profile: OAuthProfile = {
					firstName: x.first_name,
					lastName: x.last_name,
					email: x.email,
					photo: x.picture,
					provider: 'facebook'
				};
				return profile;
			})
			.toPromise();
	}
}
