import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

// let endp = "http://myapi/graphql?query="
let query = "{event{id description ngo_id event_start event_end event_address}}"
/*
  Generated class for the ProPubServiceProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GrabNpEventsProvider {
  [x: string]: any;



  constructor(public http: Http) {
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
        .get("http://ec2-13-59-91-202.us-east-2.compute.amazonaws.com:3000/graphql" + `?query=${query}`)
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
      return new Promise((resolve, reject) => {
       let headers = new Headers();
       headers.append('Content-Type', 'application/json');
       let deleteMutation = {"query":`mutation{event(action:"delete",id:${event_id}){id}}`}
      //  {"query":"mutation{event(action:\"delete\",id:4){id}}"}
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http
        .post("/graph", JSON.stringify(deleteMutation), {headers: headers})
        .subscribe(res => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
  })
};
}