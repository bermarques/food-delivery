import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';

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
  restaurants = [
    {
      uuid: 'u1d1',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      address: 'Karol Bagh, New Delhi',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
    {
      uuid: 'u1d2',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      address: 'Karol Bagh, New Delhi',
      distance: 2.5,
      price: 100,
    },
    {
      uuid: 'u1d3',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      address: 'Karol Bagh, New Delhi',
      distance: 2.5,
      price: 100,
    },
  ];

  categories: any[] = [
    {
      id: 'e00',
      name: 'Italian',
      uuid: 'u1d1',
    },
    {
      id: 'e0',
      name: 'Mexican',
      uuid: 'u1d1',
    },
  ];

  allItems = [
    {
      category_id: 'e00',
      cover: 'assets/imgs/pizza.jpg',
      desc: 'Great in taste',
      id: 'i1',
      name: 'Pizza',
      price: 120,
      rating: 0,
      status: true,
      uuid: 'u1d1',
      variation: false,
      veg: false,
    },
    {
      category_id: 'e0',
      cover: 'assets/imgs/salad.jpg',
      desc: 'Great in taste',
      id: 'i2',
      name: 'Caprese Salad',
      price: 200,
      rating: 0,
      status: true,
      uuid: 'u1d1',
      variation: false,
      veg: true,
    },
    {
      category_id: 'e00',
      cover: 'assets/imgs/pasta.jpg',
      desc: 'Great in taste',
      id: 'i3',
      name: 'Pasta',
      price: 150.5,
      rating: 0,
      status: true,
      uuid: 'u1d1',
      variation: false,
      veg: false,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('restaurantId');
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
