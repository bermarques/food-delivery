import { Injectable } from '@angular/core';
import { Address } from 'src/app/models/address.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { Order } from 'src/app/models/order.model';
import { Restaurant } from 'src/app/models/restaurant.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  banners = [
    { banner: 'assets/imgs/1.jpg' },
    { banner: 'assets/imgs/2.jpg' },
    { banner: 'assets/imgs/3.jpg' },
  ];

  restaurants: Restaurant[] = [
    {
      uuid: 'u1d1',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 10,
    },
    {
      uuid: 'u1d2',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 10,
    },
    {
      uuid: 'u1d3',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 10,
    },
  ];

  allRestaurants: Restaurant[] = [
    {
      uuid: 'u1d1',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 10,
    },
    {
      uuid: 'u1d2',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 10,
    },
    {
      uuid: 'u1d3',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 10,
    },
  ];

  restaurants1: Restaurant[] = [
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

  categories: Category[] = [
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
    {
      id: 'e0',
      name: 'Italian',
      uuid: 'u1d2',
    },
  ];

  allItems: Item[] = [
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
      cover: 'assets/imgs/pizza.jpg',
      desc: 'Great in taste',
      id: 'i1',
      name: 'Pizza',
      price: 120,
      rating: 0,
      status: true,
      uuid: 'u1d2',
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

  addresses: Address[] = [
    {
      address: 'R. Andrade Neves',
      house: '339',
      id: '7Kox63KlggTvV7ebRKar',
      landmark: 'Próximo ao supermercado',
      lat: 26.1830738,
      lng: 91.74049769999999,
      title: 'Fancy',
      user_id: '1',
    },
    {
      address: 'R. General Botelho',
      house: '411',
      id: '8Kox63KlggTvV7ebRKar',
      landmark: 'Próximo á escola',
      lat: 26.1830738,
      lng: 91.74049769999999,
      title: 'Work',
      user_id: '1',
    },
  ];

  orders: Order[] = [
    {
      address: {
        address: 'R. Genérico, 456, 5o andar',
        house: 'dsgd',
        id: 'cLQdnS8YXk5HTDfM3UQC',
        landmark: 'fdgs',
        lat: 26.108991978867923,
        lng: 91.79069981213378,
        title: 'yui',
        user_id: 'UA5JWxgjDOYgfXe92H0pFHwulTz2',
      },
      deliveryCharge: 20,
      totalPrice: 540.0,
      id: '5aG0RsPuze8NX00B7uRP',
      order: [
        {
          category_id: 'e10',
          cover: 'assets/imgs/baha.jpg',
          desc: 'Great in taste',
          id: 'i32',
          name: 'Bahamas',
          price: 270,
          quantity: 1,
          rating: 0,
          status: true,
          uuid: 'r5',
          variation: false,
          veg: false,
        },
        {
          category_id: 'e10',
          cover: 'assets/imgs/mofo.jpg',
          desc: 'Great in taste',
          id: 'i33',
          name: 'Mofongo',
          price: 250,
          quantity: 1,
          rating: 0,
          status: true,
          uuid: 'r5',
          variation: false,
          veg: true,
        },
      ],
      paid: 'COD',
      restaurant: {
        address: 'Rio Grande do Sul, Brasil',
        uuid: 'u1d1',
        city: '909090567',
        closeTime: '21:00',
        cover: '',
        cuisines: ['Caribbean food', 'North Indian', 'Vietnamese'],
        delivery_time: 25,
        description: 'dd',
        email: 'plazagrill@gmail.com',
        latitude: 26.1286243,
        longitude: 91.8012675,
        isClose: true,
        name: 'PlazaGrill',
        openTime: '07:00',
        phone: 6619563867,
        price: 27,
        rating: 4.7,
        short_name: 'stayfit',
        status: 'open',
        totalRating: 13,
      },
      restaurant_id: 'r5',
      status: 'created',
      time: 'Jul 6, 2020 11:44 AM',
      total: 520.0,
      user_id: '1',
    },
    {
      address: {
        address: 'R. Genérico, 456, 5o andar',
        house: 'dsgd',
        id: 'cLQdnS8YXk5HTDfM3UQC',
        landmark: 'fdgs',
        lat: 26.108991978867923,
        lng: 91.79069981213378,
        title: 'yui',
        user_id: 'UA5JWxgjDOYgfXe92H0pFHwulTz2',
      },
      deliveryCharge: 20,
      totalPrice: 440.0,
      id: '5aG0RsPuze8NX00B7uR1',
      order: [
        {
          category_id: 'e00',
          cover: 'assets/imgs/pizza.jpg',
          desc: 'Great in taste',
          id: 'i1',
          name: 'Pizza',
          price: 120,
          quantity: 1,
          rating: 0,
          status: true,
          uuid: 'r1',
          variation: false,
          veg: false,
        },
        {
          category_id: 'e00',
          cover: 'assets/imgs/pasta.jpg',
          desc: 'Great in taste',
          id: 'i3',
          name: 'Pasta',
          price: 150,
          quantity: 2,
          rating: 0,
          status: true,
          uuid: 'r1',
          variation: false,
          veg: false,
        },
      ],
      paid: 'COD',
      restaurant: {
        address: 'Rio Grande do Sul, Brasil',
        city: '909090271',
        uuid: 'u1d2',
        closeTime: '20:00',
        cover: 'assets/imgs/1.jpg',
        cuisines: ['Italian', 'Mexican'],
        delivery_time: 25,
        description: 'dd',
        email: 'stay@fit.com',
        isClose: true,
        latitude: 26.1286243,
        longitude: 91.8012675,
        name: 'Stayfit',
        openTime: '08:00',
        phone: 6786745745,
        price: 25,
        rating: 0,
        short_name: 'stayfit',
        status: 'open',
        totalRating: 0,
      },
      restaurant_id: 'r1',
      status: 'Delivered',
      time: 'Jul 7, 2020 11:44 AM',
      total: 420.0,
      user_id: '1',
    },
  ];
  constructor() {}
}
