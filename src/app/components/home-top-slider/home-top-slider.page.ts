import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: ' app-home-top-slider',
  templateUrl: './home-top-slider.page.html',
  styleUrls: ['./home-top-slider.page.scss'],
})
export class HomeTopSliderPage implements OnInit {
  // Slider Options
  slideOpts = {
    initialSlide: 0,
    loop: true,
    autoplay: true,
    speed: 400,
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToTDS() {
    this.router.navigate(['/menu/tds-sneaker-page']);
  }
}
