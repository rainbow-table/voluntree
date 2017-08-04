import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OAuthService } from '../../pages/oauth/oauth.service';
import { FacebookOauthProvider } from './facebook-oauth.provider';

@NgModule({
	imports: [IonicModule],
	providers: [
		OAuthService,
		FacebookOauthProvider,
	]
})
export class OAuthModule {

}
