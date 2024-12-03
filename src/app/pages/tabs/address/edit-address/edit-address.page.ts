import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  location: any = {};
  isLocationFetched: boolean;
  center: any;
  update = false;
  id: any;
  isLoading = false;

  constructor(
    private addressService: AddressService,
    private global: GlobalService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private googleMaps: GoogleMapsService
  ) {}

  ngOnInit() {
    this.checkForUpdate();
  }

  checkForUpdate() {
    this.isLoading = true;
    this.location.location_name = 'Locating...';
    this.isLocationFetched = false;
    this.route.queryParams.subscribe(async (data) => {
      if (data?.data) {
        const address = JSON.parse(data.data);
        this.center = {
          lat: address.lat,
          lng: address.lng,
        };
        this.update = true;
        this.location.lat = this.center.lat;
        this.location.lng = this.center.lng;
        this.location.address = address.address;
        this.location.location_name = address.title;
        this.id = address.id;

        this.initForm(address);
        this.toggleFetched();
      } else {
        this.update = false;
        this.initForm();
      }
    });
  }
  initForm(address?) {
    let data = {
      title: null,
      house: null,
      landmark: null,
    };

    if (address) {
      data = {
        title: address.title,
        house: address.house,
        landmark: address.landmark,
      };
    }

    this.form = new FormGroup({
      title: new FormControl(data.title, { validators: [Validators.required] }),
      house: new FormControl(data.house, { validators: [Validators.required] }),
      landmark: new FormControl(data.landmark, {
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }

  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
    this.toggleFetched();
  }

  toggleFetched() {
    this.isLocationFetched = !this.isLocationFetched;
  }

  fetchLocation(event) {
    this.location = event;
  }

  onSubmit() {
    try {
      const data = {
        title: this.form.get('title').value,
        address: this.location.address,
        house: this.form.get('house').value,
        landmark: this.form.get('landmark').value,
        lat: this.location.lat,
        lng: this.location.lng,
      };
      if (!this.id) this.addressService.addAddress(data);
      else this.addressService.updateAddress(this.id, data);
      this.navCtrl.back();
      this.toggleSubmit();
    } catch (err) {
      this.global.errorToast();
      throw err;
    }
  }

  async searchLocation() {
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass: 'address-modal',
        swipeToClose: true,
      };
      const location = await this.global.createModal(options);
      if (location) {
        this.location = location;
        const loc = {
          lat: location.lat,
          lng: location.lng,
        };
        this.update = true;
        this.googleMaps.changeMarkerInMap(loc);
      }
    } catch (err) {
      throw err;
    }
  }
}
