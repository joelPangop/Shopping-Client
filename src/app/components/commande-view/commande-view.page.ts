import {Component, OnInit} from '@angular/core';
import {CommandeService} from '../../services/commande.service';
import {AlertController, ModalController, NavParams, Platform} from '@ionic/angular';
import {environment} from '../../models/environements';
import {itemCart} from '../../models/itemCart-interface';
import {CurrencyService} from '../../services/currency.service';
import {AuthService} from '../../services/auth.service';
import {itemStatus} from '../../models/itemStatus';
import {Commande} from '../../models/commande-interface';
import {OrderStatus} from '../../models/OrderStatus';

@Component({
    selector: 'app-commande-view',
    templateUrl: './commande-view.page.html',
    styleUrls: ['./commande-view.page.scss'],
})
export class CommandeViewPage implements OnInit {

    url = environment.api_url;
    cartItems: itemCart[] = [];
    commande = {} as Commande;

    constructor(public cmdService: CommandeService, private navParams: NavParams, private modalController: ModalController,
                public cuService: CurrencyService, public authService: AuthService, public platform: Platform,
                private alertController: AlertController) {
    }

    ngOnInit() {

    }

    dismiss() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

    getRatedPrice(price: number, rate: number) {
        return price * rate;
    }

    furfilItem(item: itemCart){
        this.cmdService.getCmdByItem(item._id).subscribe((res) => {
            this.commande = res;
            for(let it of this.commande.itemsCart){
                if(it._id === item._id){
                    it.status = itemStatus.FULFILLED;
                }
            }
            const orderedItem = this.commande.itemsCart.filter((res) => {return res.status !== itemStatus.ORDERED && res.item.utilisateurId === this.authService.currentUser._id});

            if(orderedItem.length === 0){
                this.commande.status = OrderStatus.PROCESSING;
            }
            this.cmdService.update(this.commande).subscribe((res) => {
                if(res) {
                    console.info("command updated");
                    this.commande = res;
                    this.cmdService.received_orders = this.commande.itemsCart;
                }
            })
        })
    }

    handleReturn(){

    }

    isActive(item: itemCart): Boolean{
        return item.status === itemStatus.FULFILLED;
    }
}
