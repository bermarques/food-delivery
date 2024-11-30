import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  urlCheck = false;
  url = '';
  model = {} as Cart;
  deliveryCharge = 5;
  instructions: any;
  location: any = {};
  cartSub: Subscription;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private global: GlobalService,
    private navCtrl: NavController,
    private cartService: CartService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe((cart: Cart) => {
      this.model = cart;
      if (!this.model) this.location = {};
    });

    this.getModel();
  }

  checkUrl() {
    let url = this.router.url.replace('/cart', '');
    this.url = url;
    this.urlCheck = url.split('/').length > 3;
  }

  async getModel() {
    await this.checkUrl();
    this.location = {
      lat: -32.03303,
      lng: -52.099295,
      address: 'Rio Grande, Rio Grande do Sul',
    };
    await this.cartService.getCartData();
  }

  async clearCart() {
    return this.storage.removeStorage('cart');
  }

  increaseQuantity(index) {
    this.cartService.increaseQuantity(index);
  }

  decreaseQuantity(index) {
    this.cartService.decreaseQuantity(index);
  }

  addAddress() {}

  changeAddress() {}

  async makePayment() {
    try {
      const data = {
        restaurant_id: this.model.restaurant.uuid,
        restaurant: this.model.restaurant,
        instructions: this.instructions ? this.instructions : '',
        order: JSON.stringify(this.model.items),
        time: moment().format('lll'),
        address: this.location,
        totalPrice: this.model.totalPrice,
        total: this.model.total,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD',
      };
      await this.orderService.placeOrder(data);
      await this.clearCart();
      this.global.successToast('Your order has been placed successfully.');
      this.navCtrl.navigateRoot('/tabs/account');
    } catch (err) {}
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  ionViewWillLeave() {
    if (this.model?.items && this.model.items.length > 0) {
      this.cartService.saveCart();
    }
  }
}
