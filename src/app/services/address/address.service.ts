import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Address } from 'src/app/models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);

  get addresses() {
    return this._addresses.asObservable();
  }

  get addressChange() {
    return this._addressChange.asObservable();
  }

  constructor(private api: ApiService) {}

  async getAddresses(limit: number = 0) {
    try {
      let allAddress: Address[] = this.api.addresses;
      if (limit > 0) {
        allAddress = allAddress.slice(0, limit);
      }
      this._addresses.next(allAddress);
    } catch (err) {
      throw err;
    }
  }

  addAddress(param) {
    param.id = 'address1';
    param.user_id = 'user1';
    const currentAddresses = this._addresses.value;
    const newAddress = new Address(
      param.id,
      param.user_id,
      param.title,
      param.address,
      param.house,
      param.landmark,
      param.lat,
      param.lng
    );
    currentAddresses.push();
    this._addresses.next(currentAddresses);
    this._addressChange.next(newAddress);
  }

  updateAddress(id: string, param) {
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

  changeAddress(address) {
    this._addressChange.next(address);
  }
}
