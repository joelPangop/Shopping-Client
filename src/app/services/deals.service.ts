import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DealsService {

  getDeals() {
    return [{
      id: 1,
      image: "assets/images/products/deal2.jpg",
      title: "Sale 50%",
      subTitle: "Major pieces for upper half"
    }, {
      id: 2,
      image: "assets/images/products/deal1.jpeg",
      title: "Ease the day",
      subTitle: "Cute knits for taking it easy"
    }, {
      id: 3,
      image: "assets/images/banner-1.jpg",
      title: "Step way",
      subTitle: "Cause you've got places"
    }]
  }
}
