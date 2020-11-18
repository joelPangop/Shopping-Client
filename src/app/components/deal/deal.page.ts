import {Component, OnInit} from '@angular/core';
import {CartPage} from '../cart/cart.page';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {CartService} from '../../services/cart.service';
import {DealsService} from '../../services/deals.service';
import {CommandeService} from '../../services/commande.service';
import {Commande} from '../../models/commande-interface';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';

@Component({
    selector: 'app-deal',
    templateUrl: './deal.page.html',
    styleUrls: ['./deal.page.scss'],
})
export class DealPage implements OnInit {

    public cartItemCount: BehaviorSubject<number> = new BehaviorSubject(0);
    deals: any = [];
    utilisateur = {} as Utilisateur;

    constructor(private modalController: ModalController, private cartService: CartService, private dealsService: DealsService,
                private cmdService: CommandeService, private userStorageUtils: UserStorageUtils, public platform: Platform,
                private navCtrl: NavController) {
        this.cartService.getCartItemCount().subscribe((data) => {
            this.cartItemCount.next(data);
        });
    }

    async ngOnInit() {
        this.utilisateur = await this.userStorageUtils.getUser();

        this.cartService.getCartItemCount().subscribe((data) => {
            this.cartItemCount.next(data);
        });
        this.getDeals();
        let data: Commande;

        this.cmdService.loadCheckoutCommande(this.utilisateur).subscribe((res) => {
            {
                data = res;
                this.cartItemCount = new BehaviorSubject(data ? data.itemsCart.length : 0);
            }
        });
    }

    getDeals() {
        this.deals = this.dealsService.getDeals();
    }

    // Go to cart page
    async gotoCartPage() {
        const modal = await this.modalController.create({
            component: CartPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    async gotoDealListPage(option: string) {
        await this.navCtrl.navigateRoot('menu/tabs/deal-list/' + option);
    }

}
