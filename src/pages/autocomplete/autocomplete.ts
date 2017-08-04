import {Component, NgZone} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {} from '@types/googlemaps';
import googlePlacesService from 'google-maps';

@Component({
  templateUrl: 'autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, private zone: NgZone) {
    console.log('were made!..................')
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    console.log('hey')
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    console.log('hey')
    this.viewCtrl.dismiss(item);
  }
  
  updateSearch() {
    console.log('updating search............................')
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: 'US'} }, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        if (predictions) {
          predictions.forEach(function (prediction) {
            me.autocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }
} 