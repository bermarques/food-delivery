import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

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
    private googleMaps: GoogleMapsService
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

  ngOnDestroy(): void {
    if (this.placesSub) this.placesSub.unsubscribe();
  }
}
