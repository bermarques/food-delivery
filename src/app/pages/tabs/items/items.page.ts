import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  id: any;
  data: any = {};
  items: any[] = [];
  veg: boolean = false;
  cartData: any = {};
  storedData: any = {};
  isLoading = false;
  model = {
    icon: 'fast-food-outline',
    title: 'No Menu Available',
  };
  restaurants: any[] = [];
  categories: any[] = [];
  allItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('restaurantId');
      this.restaurants = this.api.restaurants1;
      this.categories = this.api.categories;
      this.allItems = this.api.allItems;
      this.getItems();
    });
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getItems() {
    this.isLoading = true;
    this.data = {};
    this.cartData = {};

    setTimeout(async () => {
      this.data = this.restaurants.find((x) => (x.uuid = this.id));
      this.categories = this.categories.filter((x) => x.uuid === this.id);
      this.items = this.allItems.filter((x) => x.uuid === this.id);
      let cart = await this.getCart();
      if (cart?.value) {
        try {
          this.storedData = JSON.parse(cart.value);

          if (
            this.id === this.storedData.restaurant.uuid &&
            this.allItems.length > 0
          ) {
            const storedItemsMap = new Map(
              this.storedData.items.map((item: any) => [item.id, item.quantity])
            );

            this.allItems.forEach((item: any) => {
              if (storedItemsMap.has(item.id)) {
                item.quantity = storedItemsMap.get(item.id);
              }
            });
          }

          this.cartData.totalItem = this.storedData.totalItem;
          this.cartData.totalPrice = this.storedData.totalPrice;
        } catch (error) {
          console.error('Erro ao processar os dados do carrinho:', error);
        }
      }
      this.isLoading = false;
    }, 500);
  }

  vegOnly(event) {
    this.items = [];
    if (event.detail.checked == true) {
      this.items = this.allItems.filter((x) => x.veg);
    } else {
      this.items = this.allItems;
    }
  }

  increaseQuantity(index) {
    try {
      if (!this.items[index].quantity || this.items[index].quantity === 0) {
        this.items[index].quantity = 1;
      } else {
        this.items[index].quantity += 1;
      }
      this.calculate();
    } catch (err) {
      console.log(err);
    }
  }

  decreaseQuantity(index) {
    if (this.items[index].quantity !== 0) {
      this.items[index].quantity -= 1;
    } else {
      this.items[index].quantity = 0;
    }
    this.calculate();
  }

  calculate() {
    this.cartData.items = [];
    let items = this.items.filter((x) => x.quantity > 0);
    this.cartData.items = items;
    this.cartData.totalPrice = 0;
    this.cartData.totalItem = 0;

    items.forEach((element) => {
      this.cartData.totalItem += element.quantity;
      this.cartData.totalPrice +=
        parseFloat(element.price) * parseFloat(element.quantity);
    });
    this.cartData.totalPrice = this.cartData.totalPrice.toFixed(2);
    if (this.cartData.totalItem === 0) {
      this.cartData.totalItem = 0;
      this.cartData.totalPrice = 0;
    }
  }

  async saveToCart() {
    try {
      this.cartData.restaurant = {};
      this.cartData.restaurant = this.data;
      await Preferences.set({
        key: 'cart',
        value: JSON.stringify(this.cartData),
      });
    } catch (err) {
      console.log(err);
    }
  }

  async viewCart() {
    if (this.cartData.items && this.cartData.items.length > 0)
      await this.saveToCart();
    this.router.navigate([this.router.url + '/cart']);
  }
}
