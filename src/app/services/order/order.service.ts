import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders = new BehaviorSubject<Order[]>([]);

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

  async placeOrder(param: Order) {
    try {
      param.user_id = '1';
      param.id = '5aG0RsPuze8NX00B7E2';
      let currentOrders: Order[] = [];
      currentOrders.push(
        new Order(
          param.address,
          param.restaurant,
          param.restaurant_id,
          param.order,
          param.total,
          param.totalPrice,
          param.deliveryCharge,
          param.status,
          param.time,
          param.paid,
          param.id,
          param.user_id,
          param.instructions
        )
      );

      currentOrders = currentOrders.concat(this._orders.value);
      this._orders.next(currentOrders);
    } catch (err) {
      throw err;
    }
  }

  updateOrder(param) {}
}
