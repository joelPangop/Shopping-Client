import {Component, OnInit} from '@angular/core';
import {CommandeService} from '../../services/commande.service';
import {ModalController, NavParams} from '@ionic/angular';
import {environment} from '../../models/environements';
import {itemCart} from '../../models/itemCart-interface';

@Component({
    selector: 'app-commande-view',
    templateUrl: './commande-view.page.html',
    styleUrls: ['./commande-view.page.scss'],
})
export class CommandeViewPage implements OnInit {

    url = environment.api_url;
    cartItems: itemCart[] = [];

    constructor(private cmdService: CommandeService, private navParams: NavParams, private modalController: ModalController) {
        this.cartItems = this.navParams.data as itemCart[];
    }

    ngOnInit() {

    }

    dismiss() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
