import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  profile: any = {};
  isLoading: boolean;
  orders: Order[] = [];
  ordersSub: Subscription;

  constructor(
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe((order) => {
      this.orders = order;
      // if (order instanceof Array) {
      //   this.orders = order;
      // } else {
      //   if (order?.delete) {
      //     this.orders = this.orders.filter((x) => x.id !== order.id);
      //   } else if (order?.update) {
      //     const index = this.orders.findIndex((x) => x.id === order.id);
      //     this.orders[index] = order;
      //   } else {
      //     this.orders = this.orders.concat(order);
      //   }
      // }
    });
    this.getData();
  }

  async getData() {
    this.isLoading = true;
    setTimeout(async () => {
      this.profile = {
        name: 'Bernardo Marques',
        phone: '53 1234 5678',
        email: 'bernardohmarques@gmail.com',
      };
      await this.orderService.getOrders();
      this.isLoading = false;
    }, 3000);
  }

  logout() {}

  async reorder(order) {
    let data: any = await this.cartService.getCart();
    if (data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }

  getHelp(order) {}

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }
}
