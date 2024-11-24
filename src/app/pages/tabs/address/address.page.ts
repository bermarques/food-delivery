import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  isLoading: boolean;
  addresses: any[] = [];

  constructor(private global: GlobalService) {}

  ngOnInit() {
    this.getAddresses();
  }

  getAddresses() {
    this.isLoading = true;

    setTimeout(() => {
      this.addresses = [
        {
          address: 'R. Andrade Neves',
          house: '339',
          id: '7Kox63KlggTvV7ebRKar',
          landmark: 'Próximo ao supermercado',
          lat: 26.1830738,
          lng: 91.74049769999999,
          title: 'Fancy',
          user_id: '1',
        },
        {
          address: 'R. General Botelho',
          house: '411',
          id: '8Kox63KlggTvV7ebRKar',
          landmark: 'Próximo á escola',
          lat: 26.1830738,
          lng: 91.74049769999999,
          title: 'Work',
          user_id: '1',
        },
      ];
      this.isLoading = false;
    }, 3000);
  }

  getIcon(title: string) {
    return this.global.getIcon(title);
  }
  editAddress(address: any) {}

  deleteAddress(address: any) {}
}
