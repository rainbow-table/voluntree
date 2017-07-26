import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { VolunteerDashPage } from '../volunteer-dash/volunteer-dash';
import { NpDashPage } from '../np-dash/np-dash';
import { OAuthService } from '../oauth/oauth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login-page.html',
  providers: [OAuthService],
  animations: [
 
    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0'}),
        animate('2000ms ease-in-out')
      ])
    ]),
 
    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0)'}),
        animate('1000ms ease-in-out')
      ])
    ]),
 
    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({transform: 'translate3d(0,2000px,0)', offset: 0}),
          style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
          style({transform: 'translate3d(0,0,0)', offset: 1}) 
        ]))
      ])
    ]),
 
    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {
  private oauthService: OAuthService;
  private nav: NavController; 
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
 
  constructor(public navCtrl: NavController, oauthService: OAuthService, nav: NavController) {
    this.oauthService = oauthService;
    this.nav = nav;    
  }
  // goToNpDash(){
  //   // push another page on to the navigation stack
  //   // causing the nav controller to transition to the new page
  //   // optional data can also be passed to the pushed page.
  //   this.navCtrl.push(NpDashPage);
  // }

  // goToVolunteerDash(){
  //   // push another page on to the navigation stack
  //   // causing the nav controller to transition to the new page
  //   // optional data can also be passed to the pushed page.
  //   this.navCtrl.push(VolunteerDashPage);
  // }

  public goToNploginPage(source: string) {
    this.oauthService.login(source)
      .then(
        () => this.nav.setRoot(NpDashPage),
        error => alert(error)
      );    
  }
  public goToVolunteerloginPage(source: string) {
    this.oauthService.login(source)
      .then(
        () => this.nav.setRoot(VolunteerDashPage),
        error => alert(error)
      );     
  }
  
}
 