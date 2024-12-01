import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';

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

  constructor(
    private addressService: AddressService,
    private global: GlobalService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.location.location_name = 'Locating...';
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', { validators: [Validators.required] }),
      house: new FormControl('', { validators: [Validators.required] }),
      landmark: new FormControl('', { validators: [Validators.required] }),
    });
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
      this.toggleSubmit();
      if (!this.form.valid || !this.isLocationFetched)
        return this.toggleSubmit();

      const data = {
        title: this.form.get('title').value,
        address: this.location.address,
        house: this.form.get('house').value,
        landmark: this.form.get('landmark').value,
        lat: this.location.lat,
        lng: this.location.lng,
      };
      this.addressService.addAddress(data);
      this.navCtrl.back();
      this.toggleSubmit();
    } catch (err) {
      this.global.errorToast();
      throw err;
    }
  }
}
