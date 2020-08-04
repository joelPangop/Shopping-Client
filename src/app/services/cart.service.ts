import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cartItemCount = new Subject<number>();

  constructor() {
    this.cartItemCount = new Subject<number>();
  }

  setCartItemCount(value: number){
    this.cartItemCount.next(value);
  }

  getCartItemCount(): Subject<number>{
    return this.cartItemCount;
  }

}
