import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address/address.service';
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
  savedPlaces: Address[];
  addressSub: Subscription;
  @Input() from;

  constructor(
    private global: GlobalService,
    private googleMaps: GoogleMapsService,
    private locationService: LocationService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.placesSub = this.googleMaps.places.subscribe((places) => {
      this.places = places;
    });
    if (this.from) {
      this.getSavedPlaces();
    }
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

  async getSavedPlaces() {
    this.global.showLoader();
    this.addressSub = this.addressService.addresses.subscribe((addresses) => {
      this.savedPlaces = addresses;
    });
    await this.addressService.getAddresses(
      this.from === 'home' ? 2 : undefined
    );
    this.global.hideLoader();
  }

  selectPlace(place) {
    this.dismiss(place);
  }
  ngOnDestroy(): void {
    if (this.placesSub) this.placesSub.unsubscribe();
    if (this.addressSub) this.addressSub.unsubscribe();
  }
}
