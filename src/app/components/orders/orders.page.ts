import {Component, OnInit} from '@angular/core';
import {Utilisateur} from '../../models/utilisateur-interface';
import {CommandeService} from '../../services/commande.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Commande} from '../../models/commande-interface';
import {OrderStatus} from '../../models/OrderStatus';
import {ProductViewPage} from '../product-view/product-view.page';
import {OrderViewPage} from '../order-view/order-view.page';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

    utilisateur: Utilisateur;

    // Order Options
    options: any = [
        {
            title: 'ALL',
            isSelected: true
        },
        {
            title: 'InComplete',
            isSelected: false
        },
        {
            title: 'Delivered',
            isSelected: false
        }, {
            title: 'Processing',
            isSelected: false
        }, {
            title: 'Cancelled',
            isSelected: false
        }];

    commandes: Commande[] = [];

    constructor(private cmdService: CommandeService, private userStorageUtils: UserStorageUtils, private modalController: ModalController) {

    }

    async ngOnInit() {
        this.utilisateur = await this.userStorageUtils.getUser();
        this.getCommandes().subscribe((res) => {
            this.commandes = res;

        });
    }

    getCommandes() {
        return this.cmdService.getAll(this.utilisateur);
    }

    // Change Order Option Function
    changeOption(option, index) {
        for (let i = 0; i < this.options.length; i++) {
            this.options[i].isSelected = false;
        }

        this.options[index].isSelected = true;

        switch (this.options[index].title) {
            case 'ALL':
                this.getCommandes().subscribe((res) => {
                    this.commandes = res;
                });
                break;
            case 'InComplete':
                this.getCommandes().subscribe((res) => {
                    this.commandes = res.filter(c => c.completed === false);
                });
                break;
            case 'Cancelled':
                this.getCommandes().subscribe((res) => {
                    this.commandes = res.filter(c => c.status === OrderStatus.CANCELLED && c.completed === true);
                });
                break;
            case 'Delivered':
                this.getCommandes().subscribe((res) => {
                    this.commandes = res.filter(c => c.status === OrderStatus.DELIVERED && c.completed === true);
                });
                break;
            case 'Processing':
                this.getCommandes().subscribe((res) => {
                    this.commandes = res.filter(c => c.status === OrderStatus.PROCESSING && c.completed === true);
                });
                break;
        }

    }

    async showDetails(commande: Commande) {
        const modal = await this.modalController.create({
            component: OrderViewPage,
            componentProps: commande,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

}
