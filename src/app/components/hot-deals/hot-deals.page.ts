import { Component, OnInit } from '@angular/core';
import {DealsService} from '../../services/deals.service';

@Component({
  selector: 'app-hot-deals',
  templateUrl: './hot-deals.page.html',
  styleUrls: ['./hot-deals.page.scss'],
})
export class HotDealsPage implements OnInit {

  // Slider Options
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 2,
  };

  deals: any = [];

  constructor(private dealsService: DealsService) { }

  ngOnInit() {
    this.getDeals();
  }

  getDeals() {
    this.deals = this.dealsService.getDeals();
  }
}
