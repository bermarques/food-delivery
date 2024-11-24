import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private _addresses = new BehaviorSubject<any>(null);

  get addresses() {
    return this._addresses.asObservable();
  }

  constructor(private api: ApiService) {}

  getAddresses() {
    try {
      let allAddress: any[] = this.api.addresses;
      this._addresses.next(allAddress);
    } catch (err) {
      throw err;
    }
  }

  addAddress(param) {}

  updateAddress(id, param) {}

  deleteAddress(param) {
    param.delete = true;
    this._addresses.next(param);
  }
}
