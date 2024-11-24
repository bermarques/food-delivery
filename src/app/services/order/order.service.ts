import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders = new BehaviorSubject<any>(null);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(private api: ApiService) {}

  getOrders() {
    try {
      const orders = this.api.orders;
      this._orders.next(orders);
    } catch (err) {
      throw err;
    }
  }

  placeOrder(param) {
    try {
      param.user_id = '1';
      param.order = JSON.parse(param.order);
      param.id = '5aG0RsPuze8NX00B7E2';
      this._orders.next(param);
    } catch (err) {
      throw err;
    }
  }

  updateOrder(param) {}
}
