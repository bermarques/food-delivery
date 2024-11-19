import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchInput') sInput;
  isLoading: boolean;
  query: any;
  allRestaurants: any[] = [
    {
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 10,
    },
    {
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 10,
    },
    {
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 10,
    },
  ];

  restaurants: any[] = [];
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
  }

  async onSearchChange(event) {
    this.query = event.detail.value.toLowerCase();

    if (this.query.length > 0) {
      this.isLoading = true;
      setTimeout(async () => {
        this.restaurants = await this.allRestaurants.filter((item) => {
          return item.short_name.includes(this.query);
        });
        this.isLoading = false;
      }, 3000);
    }
  }
}
