import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index: any;
  @Output() add: EventEmitter<Item> = new EventEmitter();
  @Output() remove: EventEmitter<Item> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    console.log(this.item);
  }

  increaseQuantity() {
    this.add.emit(this.item);
  }

  decreaseQuantity() {
    this.remove.emit(this.item);
  }
}
