import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/RX';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the NpCalProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NpCalProvider {

  constructor(public http: Http) {
    console.log('Hello NpCalProvider Provider');
  }
    public dbUrl = 'http://localhost:3000/graphql';
    public events;

  getCalEvents(body: Object){
    this.http.post(this.dbUrl, body)
    .map((res) => {
      return res.json()
    }).subscribe(data => this.events = data.data);
    return this.events;
  }
}
