import { Component, OnInit } from '@angular/core';
import {MenuController, ModalController} from '@ionic/angular';
import {Utilisateur} from '../../../models/utilisateur-interface';
import {UserStorageUtils} from '../../../services/UserStorageUtils';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {

  utilisateur = {} as Utilisateur;

  constructor(public modalController: ModalController, private userStorageUtils: UserStorageUtils) { }

  ngOnInit() {
    this.userStorageUtils.getUser().then(res => {
      this.utilisateur = res as Utilisateur;
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
