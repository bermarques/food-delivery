import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Cart } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';
import { AddressService } from 'src/app/services/address/address.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  urlCheck = false;
  url = '';
  model = {} as Cart;
  deliveryCharge = 5;
  instructions: any;
  location: any = {};
  cartSub: Subscription;
  addressSub: Subscription;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private global: GlobalService,
    private navCtrl: NavController,
    private cartService: CartService,
    private storage: StorageService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe((address) => {
      this.location = address;
    });
    this.cartSub = this.cartService.cart.subscribe((cart) => {
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
    this.checkUrl();
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

  addAddress() {
    let url;
    if (!this.urlCheck) url = ['/', 'tabs', 'address', 'edit-address'];
    else url = [this.router.url, 'address', 'edit-address'];
    this.router.navigate(url);
  }

  async changeAddress() {
    try {
      const options = {
        component: SearchLocationComponent,
        swipeToClose: true,
        cssClass: 'custom-modal',
        componentProps: {
          from: 'cart',
        },
      };
      const address = await this.global.createModal(options);
      if (address) {
        if (address === 'add') return this.addAddress();
        this.addressService.changeAddress(address);
      }
    } catch (err) {}
  }

  async makePayment() {
    try {
      const data: Order = {
        restaurant_id: this.model.restaurant.uuid,
        restaurant: this.model.restaurant,
        instructions: this.instructions ? this.instructions : '',
        order: this.model.items,
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

  ngOnDestroy() {
    if (this.addressSub) this.addressSub.unsubscribe();
    if (this.cartSub) this.cartSub.unsubscribe();
  }
}
