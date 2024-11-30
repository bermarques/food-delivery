import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index: any;
  @Output() add: EventEmitter<Item> = new EventEmitter();
  @Output() remove: EventEmitter<Item> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  increaseQuantity() {
    this.add.emit(this.index);
  }

  decreaseQuantity() {
    this.remove.emit(this.index);
  }
}
