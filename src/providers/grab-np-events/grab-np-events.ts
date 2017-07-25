import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// let endp = "http://myapi/graphql?query="
let query = "{event{id description ngo_id event_start event_end}}"
/*
  Generated class for the ProPubServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GrabNpEventsProvider {
  [x: string]: any;



  constructor(public http: Http) {
    console.log("Hello GrabNpEventsProvider Provider");
    
  }

  
  //  makeRequest() {
  //       return this.http.get('/graphql' + `graphql?query=${query}`)
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
        .get("/graphQL" + `/graphql?query=${query}`)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          // this.data = data.organizations;
          resolve(this.data)
        })
    });
  }

  deleteEvent(event_id) {
    // if (this.data) {
    //   // already loaded data
    //   return Promise.resolve(this.data);
    // }

    // don't have the data yet
    // return new Promise(resolve => {

       let deleteMutation = `{"query":"mutation{event(action:\"delete\",id:${event_id}){id}}"}`
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      return this.http
        .post("/graphQL", deleteMutation)
        // .map(res => res.json())
        // .subscribe(data => {
        //   // we've got back the raw data, now generate the core schedule data
        //   // and save the data for later reference
        //   this.data = data;
        //   // this.data = data.organizations;
        //   resolve(this.data)
        // })
    // });
  }
}
