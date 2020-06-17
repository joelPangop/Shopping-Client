import {Component, OnInit} from '@angular/core';
import {itemCart} from '../../models/itemCart-interface';
import {ModalController, NavController, NavParams} from '@ionic/angular';
import {Article} from '../../models/article-interface';
import {Commande} from '../../models/commande-interface';
import {CartPage} from '../cart/cart.page';
import {CheckoutPage} from '../checkout/checkout.page';

@Component({
    selector: 'app-order-view',
    templateUrl: './order-view.page.html',
    styleUrls: ['./order-view.page.scss'],
})
export class OrderViewPage implements OnInit {
    cartItems: itemCart[] = [];
    commande: Commande;

    constructor(private navParams: NavParams, private modalController: ModalController) {
        this.commande = this.navParams.data as Commande;
    }

    ngOnInit() {
      this.cartItems = this.commande.itemsCart;
    }

    async goToCheckout() {
        this.dismiss();
        const modal = await this.modalController.create({
            component: CheckoutPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    dismiss() {
      this.modalController.dismiss({
        dismissed: true
      });
    }
}
