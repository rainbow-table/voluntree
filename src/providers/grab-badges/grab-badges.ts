import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GrabBadgesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

  
@Injectable()
export class GrabBadgesProvider {
   
public badge;
public image;

  constructor(public http: Http) {
    console.log('Hello GrabBadgesProvider Provider');
  }

  grabBadgeById(id) { 
     if (this.badge) {
      return Promise.resolve(this.badge);
    }
        return new Promise(resolve => {
          this.http
             .post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
          query: `query {badges_volunteer(volunteerId: ${id}){badgeId}}`
        })     
          .map(res => res.json())
          .subscribe(data => {
          this.badge = data.data;
          resolve(this.badge);
          })
        });
      }

      grabBadgeImg(badgeId) { 
     if (this.image) {
      return Promise.resolve(this.image);
    }
        return new Promise(resolve => {
          this.http
             .post('http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql', {
          query: `{badge(id:${badgeId}){name img}}` 
        })     
          .map(res => res.json())
          .subscribe(data => {
          this.image = data.data;
          resolve(this.image);
          })
        });
      }
};

