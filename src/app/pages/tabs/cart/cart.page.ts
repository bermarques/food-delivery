import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  urlCheck = false;
  url = '';
  model: any;
  deliveryCharge = 5;
  instructions: any;
  location: any = {};
  constructor(private router: Router) {}

  ngOnInit() {
    let url = this.router.url.replace('/cart', '');
    this.url = url;
    this.urlCheck = url.split('/').length > 3;
    this.getModel();
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getModel() {
    let data: any = await this.getCart();
    this.location = {
      lat: -32.03303,
      lng: -52.099295,
      address: 'Rio Grande, Rio Grande do Sul',
    };
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      this.calculate();
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
      this.model = null;
    }
  }

  async clearCart() {
    return Preferences.remove({ key: 'cart' });
  }

  increaseQuantity(index) {
    try {
      if (
        !this.model.items[index].quantity ||
        this.model.items[index].quantity === 0
      ) {
        this.model.items[index].quantity = 1;
      } else {
        this.model.items[index].quantity += 1;
      }
      this.calculate();
    } catch (err) {
      console.log(err);
    }
  }

  decreaseQuantity(index) {
    if (this.model.items[index].quantity !== 0) {
      this.model.items[index].quantity -= 1;
    } else {
      this.model.items[index].quantity = 0;
    }
    this.calculate();
  }

  addAddress() {}

  changeAddress() {}

  makePayment() {
    try {
      const data = {
        restaurant_id: this.model.restaurant.uuid,
        restaurant: this.model.restaurant,
        order: JSON.stringify(this.model.items),
        time: moment().format('lll'),
        address: this.location,
        totalPrice: this.model.totalPrice,
        total: this.model.total,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD',
      };
      console.log('order', data);
    } catch (err) {}
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }
}
