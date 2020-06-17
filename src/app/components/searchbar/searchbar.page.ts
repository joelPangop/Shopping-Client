import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SearchPage} from '../search/search.page';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.page.html',
  styleUrls: ['./searchbar.page.scss'],
})
export class SearchbarPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async gotoSearchPage() {
    const modal = await this.modalController.create({
      component: SearchPage
    });
    return await modal.present();
  }

}
