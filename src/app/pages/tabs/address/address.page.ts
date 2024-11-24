import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit, OnDestroy {
  isLoading: boolean;
  addresses: any[] = [];
  addressesSub: Subscription;
  model: any = {
    title: 'No Addreses Found',
    icon: 'location-outline',
  };

  constructor(
    private global: GlobalService,
    private addressService: AddressService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.addressesSub = this.addressService.addresses.subscribe((address) => {
      if (address instanceof Array) {
        this.addresses = address;
      } else {
        if (address?.delete) {
          this.addresses = this.addresses.filter((a) => a.id !== address.id);
        } else if (address?.update) {
          const index = this.addresses.findIndex((a) => a.id === address.id);
          this.addresses[index] = address;
        } else {
          this.addresses = this.addresses.concat(address);
        }
      }
    });

    this.getAddresses();
  }

  async getAddresses() {
    this.isLoading = true;
    this.globalService.showLoader();

    setTimeout(async () => {
      await this.addressService.getAddresses();
      this.globalService.hideLoader();
      this.isLoading = false;
    }, 500);
  }

  getIcon(title: string) {
    return this.global.getIcon(title);
  }
  editAddress(address: any) {}

  deleteAddress(address: any) {
    this.globalService.showAlert(
      'Are you sure you want to delete this address?',
      'Confirm',
      [
        {
          text: 'Yes',
          role: 'confirm',
          handler: async () => {
            this.globalService.showLoader();
            await this.addressService.deleteAddress(address);
            this.globalService.hideLoader();
          },
        },
        { text: 'No', role: 'cancel' },
      ]
    );
  }

  ngOnDestroy() {
    if (this.addressesSub) this.addressesSub.unsubscribe();
  }
}
