import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  banners: any[] = [];

  constructor() {}

  ngOnInit() {
    this.banners = [
      { banner: 'assets/imgs/1.jpg' },
      { banner: 'assets/imgs/2.jpg' },
      { banner: 'assets/imgs/3.jpg' },
    ];
  }
}
