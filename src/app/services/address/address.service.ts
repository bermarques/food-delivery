import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Address } from 'src/app/models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private _addresses = new BehaviorSubject<Address[]>([]);

  get addresses() {
    return this._addresses.asObservable();
  }

  constructor(private api: ApiService) {}

  getAddresses() {
    try {
      let allAddress: Address[] = this.api.addresses;
      this._addresses.next(allAddress);
    } catch (err) {
      throw err;
    }
  }

  addAddress(param: Address) {
    const currentAddresses = this._addresses.value;
    currentAddresses.push(
      new Address(
        param.id,
        param.user_id,
        param.title,
        param.address,
        param.house,
        param.landmark,
        param.lat,
        param.lng
      )
    );
    this._addresses.next(currentAddresses);
  }

  updateAddress(id: string, param: Address) {
    param.id = id;
    let currentAddresses = this._addresses.value;
    const index = currentAddresses.findIndex((x) => x.id === id);
    currentAddresses[index] = new Address(
      id,
      param.user_id,
      param.title,
      param.address,
      param.house,
      param.landmark,
      param.lat,
      param.lng
    );
    this._addresses.next(currentAddresses);
  }

  deleteAddress(param: Address) {
    let currentAddresses = this._addresses.value;
    currentAddresses = currentAddresses.filter((x) => x.id !== param.id);
    this._addresses.next(currentAddresses);
  }
}
