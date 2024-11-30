import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { Subscription, take } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit, OnDestroy {
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
  restaurants: Restaurant[] = [];
  categories: Category[] = [];
  allItems: any[] = [];
  cartSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private api: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe((paramMap) => {
      if (!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }
      this.id = paramMap.get('restaurantId');
      console.log(this.id);
    });

    this.cartSub = this.cartService.cart.subscribe((cart) => {
      this.cartData = {};
      this.storedData = {};

      if (cart && cart?.totalItem > 0) {
        this.storedData = cart;
        this.updateCartData();

        if (cart?.restaurant?.uuid === this.id) {
          this.updateAllItems(cart.items);
          this.filterItemsBasedOnVeg();
        } else {
          this.resetAllItemsQuantities();
          this.filterItemsBasedOnVeg();
        }
      }
    });
    this.getItems();
  }
  async getItems() {
    this.isLoading = true;
    this.data = {};
    this.cartData = {};
    this.storedData = {};

    setTimeout(async () => {
      try {
        this.data = this.api.restaurants1.find((x) => (x.uuid = this.id));
        this.categories = this.api.categories.filter((x) => x.uuid === this.id);
        this.allItems = this.api.allItems.filter((x) => x.uuid === this.id);
        this.items = [...this.allItems];
        await this.cartService.getCartData();
      } catch (error) {
        console.error('Erro ao processar os dados do carrinho:', error);
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

  updateCartData() {
    this.cartData.totalItem = this.storedData.totalItem;
    this.cartData.totalPrice = this.storedData.totalPrice;
  }

  updateAllItems(cartItems) {
    this.allItems.forEach((element) => {
      cartItems.forEach((cartItem) => {
        if (element.id === cartItem.id) {
          element.quantity = cartItem.quantity;
        }
      });
    });

    console.log('allitems: ', this.allItems);
    this.cartData.items = this.allItems.filter((x) => x.quantity > 0);
  }

  resetAllItemsQuantities() {
    this.allItems.forEach((element) => {
      element.quantity = 0;
    });
  }

  filterItemsBasedOnVeg() {
    if (this.veg) {
      this.items = this.allItems.filter((x) => x.veg === true);
    } else {
      this.items = [...this.allItems];
    }
  }

  increaseQuantity(item) {
    const index = this.allItems.findIndex((x) => x.id === item.id);
    if (!this.allItems[index].quantity || this.allItems[index].quantity == 0) {
      if (
        !this.storedData.restaurant ||
        (this.storedData.restaurant &&
          this.storedData.restaurant.uuid === this.id)
      ) {
        console.log('index item: ', this.allItems);
        this.cartService.increaseQuantity(index, this.allItems, this.data);
      } else {
        this.cartService.alertClearCart(index, this.allItems, this.data);
      }
    } else {
      this.cartService.increaseQuantity(index, this.allItems, this.data);
    }
  }

  decreaseQuantity(item) {
    const index = this.allItems.findIndex((x) => x.id === item.id);
    this.cartService.decreaseQuantity(index);
  }

  async saveToCart() {
    try {
      this.cartData.restaurant = {};
      this.cartData.restaurant = this.data;
      this.cartService.saveCart();
    } catch (err) {
      console.log(err);
    }
  }

  async viewCart() {
    if (this.cartData.items && this.cartData.items.length > 0)
      await this.saveToCart();
    this.router.navigate([this.router.url + '/cart']);
  }

  async ionViewWillLeave() {
    console.log('ionViewWillLeave ItemsPage');
    if (this.cartData?.items && this.cartData?.items.length > 0)
      await this.saveToCart();
  }

  ngOnDestroy() {
    if (this.cartSub) this.cartSub.unsubscribe();
  }
}
