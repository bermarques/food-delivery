import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, OnDestroy {
  query: string;
  places: any[];
  placesSub: Subscription;

  constructor(
    private global: GlobalService,
    private googleMaps: GoogleMapsService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.placesSub = this.googleMaps.places.subscribe((places) => {
      this.places = places;
    });
  }

  async onSearchChange(event) {
    this.global.showLoader();
    this.query = event.detail.value;

    if (this.query.length > 0) {
      await this.googleMaps.getPlaces(this.query);
    }
    this.global.hideLoader();
  }

  dismiss(val?) {
    this.global.modalDismiss(val);
  }

  choosePlace(place) {
    this.global.modalDismiss(place);
  }

  async getCurrentPosition() {
    try {
      this.global.showLoader();
      const position = await this.locationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const results = await this.googleMaps.getAddress(latitude, longitude);
      const place = {
        location_name: results.address_components[0].short_name,
        address: results.formatted_address,
        lat: latitude,
        lng: longitude,
      };
      this.global.hideLoader();
      this.dismiss(place);
    } catch (err) {
      this.global.hideLoader();

      this.global.errorToast(
        'Check if GPS is enabled and the app has its location permission.',
        5000
      );
    }
  }
  ngOnDestroy(): void {
    if (this.placesSub) this.placesSub.unsubscribe();
  }
}
