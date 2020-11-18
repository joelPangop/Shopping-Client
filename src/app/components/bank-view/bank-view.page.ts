import { Component, OnInit } from '@angular/core';
import {NavParams} from '@ionic/angular';

@Component({
  selector: 'app-bank-view',
  templateUrl: './bank-view.page.html',
  styleUrls: ['./bank-view.page.scss'],
})
export class BankViewPage implements OnInit {

  bank: any;

  constructor(public navParams: NavParams) {
    this.bank = this.navParams.get('bank');
  }

  ngOnInit() {
  }

}
