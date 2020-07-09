import {Component, OnInit} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

    utilisateur = {} as Utilisateur;

    constructor(private menuController: MenuController, private userStorageUtils: UserStorageUtils) {
        this.menuController.enable(true); // Enable side menu
        this.userStorageUtils.getUser().then(res => {
            this.utilisateur = res as Utilisateur;
        });
    }

}
