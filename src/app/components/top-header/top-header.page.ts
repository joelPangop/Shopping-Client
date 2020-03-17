import { Component, OnInit } from '@angular/core';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {PopoverController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.page.html',
  styleUrls: ['./top-header.page.scss'],
})
export class TopHeaderPage implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  public async showOptions(ev, option) {
    const popover = await this.popoverController.create({
      component: ShowOptionsPage,
      event: ev,
      translucent: true,
      componentProps: {
        option
      }
    });
    return await popover.present();
  }

}
