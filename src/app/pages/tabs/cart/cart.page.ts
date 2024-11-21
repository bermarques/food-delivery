import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  urlCheck = false;
  url = '';
  model: any;
  deliveryCharge = 5;
  instructions: any;
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
    console.log(this.deliveryCharge);
    this.model.deliveryCharge = this.deliveryCharge;
    console.log(this.model.deliveryCharge);
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

  increaseQuantity(index) {}

  decreaseQuantity(index) {}

  addAddress() {}

  changeAddress() {}

  makePayment() {}
}
