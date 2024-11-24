import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  profile: any = {};
  isLoading: boolean;
  orders: any[] = [];
  ordersSub: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe((order) => {
      console.log(order);
      if (order instanceof Array) {
        this.orders = order;
      }
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

  reorder(order) {}

  getHelp(order) {}

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }
}
