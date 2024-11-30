import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { GlobalService } from '../global/global.service';
import { Router } from '@angular/router';
import { Cart } from 'src/app/models/cart.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  model: any = {};
  deliveryCharge = 20;
  private _cart = new BehaviorSubject<Cart>(null);

  get cart() {
    return this._cart.asObservable();
  }

  constructor(
    private storage: StorageService,
    private global: GlobalService,
    private router: Router
  ) {}

  getCart() {
    return this.storage.getStorage('cart');
  }

  async getCartData() {
    let data: any = await this.getCart();
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      await this.calculate();
      this._cart.next(this.model);
    }
  }

  async calculate() {
    let item = this.model.items.filter((item) => item.quantity > 0);
    this.model.items = item;
    this.model.totalPrice = 0;
    this.model.totalItem = 0;
    this.model.deliveryCharge = 0;
    this.model.total = 0;

    item.forEach((element) => {
      this.model.totalItem += element.quantity;
      this.model.totalPrice +=
        parseFloat(element.price) * parseFloat(element.quantity);
    });
    this.model.deliveryCharge = this.deliveryCharge;
    this.model.totalPrice = this.model.totalPrice.toFixed(2);
    this.model.total = (
      parseFloat(this.model.totalPrice) + parseFloat(this.model.deliveryCharge)
    ).toFixed(2);
    if (this.model.totalItem === 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.totalPrice = 0;
      await this.clearCart();
      this.model = {};
    }
  }

  alertClearCart(index, items, data, order?) {
    this.global.showAlert(
      order
        ? 'Would you like to reset your cart before re-ordering from this restaurant?'
        : 'Your cart contain items from a different restaurant. Would you like to reset your cart before browsing the restaurant?',
      'Items already in Cart',
      [
        {
          text: 'Yes',
          handler: () => {
            this.clearCart();
            this.model = {};
            if (order) {
              this.orderToCart(order);
            } else this.increaseQuantity(index, items, data);
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return;
          },
        },
      ]
    );
  }
  async increaseQuantity(index, items?: Item[], restaurant?: Restaurant) {
    try {
      if (items) {
        this.model.items = [...items];
      }
      if (restaurant) {
        this.model.restaurant = {};
        this.model.restaurant = restaurant;
      }
      if (
        !this.model.items[index].quantity ||
        this.model.items[index].quantity == 0
      ) {
        this.model.items[index].quantity = 1;
      } else {
        this.model.items[index].quantity += 1;
      }
      await this.calculate();
      this._cart.next(this.model);
    } catch (e) {
      throw e;
    }
  }

  decreaseQuantity(index?, items?: Item[]) {
    if (items) {
      this.model.items = [...items];
    }
    if (this.model.items[index].quantity !== 0) {
      this.model.items[index].quantity -= 1;
    } else {
      this.model.items[index].quantity = 0;
    }
    this.calculate();
    this._cart.next(this.model);
  }

  async clearCart() {
    this.global.showLoader();
    await this.storage.removeStorage({ key: 'cart' });
    this._cart.next(null);
    this.global.hideLoader();
  }

  saveCart(model?) {
    if (model) this.model = model;
    this.storage.setStorage('cart', JSON.stringify(this.model));
  }

  async orderToCart(order: Order) {
    const data = {
      restaurant: order.restaurant,
      items: order.order,
    };
    this.model = data;
    await this.calculate();
    this.saveCart();
    this._cart.next(data);
    this.router.navigate(['/', 'tabs', 'restaurants', order.restaurant.uuid]);
  }
}
