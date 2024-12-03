import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  banners: any[] = [];
  restaurants: Restaurant[] = [];
  isLoading: boolean = false;
  addressSub: Subscription;
  location = {} as Address;

  constructor(
    private api: ApiService,
    private addressService: AddressService,
    private global: GlobalService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe({
      next: (address) => {
        if (address?.lat) {
          if (!this.isLoading) this.isLoading = true;
          this.location = address;
          this.nearbyApiCall(address.lat, address.lng);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.global.errorToast();
      },
    });

    this.isLoading = true;
    this.getBanners();
    if (!this.location?.lat) {
      this.getNearbyRestaurants();
    }
  }

  getBanners() {
    this.banners = this.api.banners;
  }

  async nearbyApiCall(lat, lng) {
    this.restaurants = this.api.restaurants;
  }

  async getNearbyRestaurants() {
    try {
      const position = await this.locationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      await this.getData(latitude, longitude);
      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
      this.searchLocation('home', 'home-modal');
    }
  }

  async getData(latitude: number, longitude: number) {
    try {
      this.restaurants = [];
      await this.nearbyApiCall(latitude, longitude);
    } catch (error) {
      this.global.errorToast();
    }
  }

  async searchLocation(prop, className?) {
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass: className,
        backdropDismiss: prop === 'select-place',
        componentProps: {
          from: prop,
        },
      };
      const modal = await this.global.createModal(options);
      if (modal) {
        if (modal === 'select') {
          this.searchLocation('select-place');
        }
        this.location = modal;
        await this.getData(modal.lat, modal.lng);
      }
    } catch (error) {}
  }
}
