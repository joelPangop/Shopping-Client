import { Component, OnInit } from '@angular/core';
import {MenuController, ModalController, Platform} from '@ionic/angular';
import {Utilisateur} from '../../../models/utilisateur-interface';
import {UserStorageUtils} from '../../../services/UserStorageUtils';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {

  utilisateur = {} as Utilisateur;

  constructor(public modalController: ModalController, public platform: Platform) { }

  ngOnInit() {

  }

  dismiss() {
    // this.modalController.dismiss({
    //   dismissed: true
    // });
  }
}
