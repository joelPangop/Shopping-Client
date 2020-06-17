import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-onbroading',
  templateUrl: './onbroading.page.html',
  styleUrls: ['./onbroading.page.scss'],
})
export class OnbroadingPage implements OnInit {

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

  constructor(private authService: AuthService, private platform: Platform, private router: Router) { }

  async ngOnInit() {
  //   await this.authService.authenticationState.subscribe(async state => {
  //     if (state) {
  //       // this.router.navigate(['menu/product-list']);
  //       // let page;
  //       // if (this.platform.is('ios') || this.platform.is('android')) {
  //       //   page = this.storage.getItem('page');
  //       // } else if (!this.platform.is('ios') && !this.platform.is('android')) {
  //       //   page = this.localStorage.get('page');
  //       // }
  //       // page.then(r => console.log(r));
  //       await this.router.navigate(['tabs/tab1']);
  //     } else {
  //       await this.router.navigate(['']);
  //     }
  //   });
  }

}
