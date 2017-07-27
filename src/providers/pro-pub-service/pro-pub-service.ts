import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


// let np_state = "state%5Bid%5D=LA";
// let np_ID = "ntee%5Bid%5D=3";
let tail = "?state%5Bid%5D=LA&ntee%5Bid%5D=3"

/*
  Generated class for the ProPubServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProPubServiceProvider {
  [x: string]: any;

  constructor(public http: Http) {
  }
  
  findSingle(ein) {
    return new Promise (resolve => {
      this.http
        .get(`https://projects.propublica.org/nonprofits/api/v2/organizations/${ein}.json`)
        .map(res => res.json())
        .subscribe((data: any) => resolve(data), (error: any) => resolve(error))
    })
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http
        .get(`https://projects.propublica.org/nonprofits/api/v2/search.json${tail}`)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          this.data = data.organizations;
          resolve(this.data)
        //   this.data.http.get(`/propublicORG/${this.ein}.json`)
        // .map(res => res.json())
        // .subscribe(data => {
          
        //   // we've got back the raw data, now generate the core schedule data
        //   // and save the data for later reference
        //   this.data = data;
        //   this.data = data.organization;
        //   resolve(this.data);
        // });
        })
    });
  }
}
