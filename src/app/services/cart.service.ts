import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemCount = new Subject<number>();

  constructor() { }

  setCartItemCount(value: number){
    this.cartItemCount.next(value);
  }

  getCartItemCount(): Subject<number>{
    return this.cartItemCount;
  }

}
