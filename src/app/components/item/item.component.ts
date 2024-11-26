import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() item: any;
  @Input() index: any;
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();
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
