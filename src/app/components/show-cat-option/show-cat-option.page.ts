import { Component, OnInit } from '@angular/core';
import {NavParams} from '@ionic/angular';
import {Currencies} from '../../models/Currencies';

@Component({
  selector: 'app-show-cat-option',
  templateUrl: './show-cat-option.page.html',
  styleUrls: ['./show-cat-option.page.scss'],
})
export class ShowCatOptionPage implements OnInit {

  categoriesOptions: any[];
  categoryOption: any;

  constructor(public navParams: NavParams) {
    this.categoriesOptions = this.navParams.get('categoryOptions');
    this.categoryOption = this.navParams.get('categoryOption');
  }

  ngOnInit() {
    this.categoriesOptions = this.navParams.get('categoryOptions');
    this.categoryOption = this.navParams.get('categoryOption');
  }


  setCategory(l: any) {
    const popover = this.navParams.get('popover');
    popover.dismiss({
      categoryOption: l
    });
  }
}
