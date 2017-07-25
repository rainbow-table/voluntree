
import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public facebook = {
		apiUrl: 'https://graph.facebook.com/v2.10/',
		appId: '1696263364016115',
		scope: ['public_profile']
	}
	public google = {
		apiUrl: 'https://www.googleapis.com/oauth2/v3/',
		appId: '570728222195-im2cupjumbblde070cj179c6ro0aee5n.apps.googleusercontent.com',
		scope: ['email']
	}
}
