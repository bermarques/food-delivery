import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title: 'No Restaurants Found',
  };
  isLoading: boolean;
  query: any;
  allRestaurants: any[] = [];

  restaurants: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    setTimeout(() => {
      this.allRestaurants = this.api.allRestaurants;
      this.sInput.setFocus();
    }, 500);
  }

  async onSearchChange(event) {
    this.query = event.detail.value.toLowerCase();

    if (this.query.length > 0) {
      this.isLoading = true;
      this.restaurants = await this.allRestaurants.filter((item) => {
        return item.short_name.includes(this.query);
      });
      this.isLoading = false;
    } else {
      this.restaurants = [];
    }
  }
}
