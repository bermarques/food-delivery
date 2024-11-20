import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  model = {
    icon: 'fast-food-outline',
    title: 'No Menu Available',
  };
  restaurants = [
    {
      uuid: '12wefdss',
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
      uuid: '12wefdefsdss',
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
      uuid: '12wefdssrete',
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
      uuid: '12wefdss',
    },
    {
      id: 'e0',
      name: 'Mexican',
      uuid: '12wefdss',
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
      uuid: '12wefdss',
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
      uuid: '12wefdss',
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
      uuid: '12wefdss',
      variation: false,
      veg: false,
    },
  ];

  constructor(private route: ActivatedRoute, private navCtrl: NavController) {}

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

  getItems() {
    this.data = {};
    this.data = this.restaurants.find((x) => (x.uuid = this.id));
    this.items = this.allItems;
  }

  getCuisine(cuisine) {
    return cuisine.join(', ');
  }

  vegOnly(event) {}
}
