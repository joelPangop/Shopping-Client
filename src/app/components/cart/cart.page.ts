import {Component, OnInit} from '@angular/core';
import {itemCart} from '../../models/itemCart-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {NavController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {Utilisateur} from '../../models/utilisateur-interface';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

    cartItems: itemCart[];
    total = 0;
    returnPage: string;
    utilisateur = {} as Utilisateur;
    cartItemCount = new BehaviorSubject(0);
    imgURL: any;

    constructor(private storage: NativeStorage, private toastCtrl: ToastController,
                private navCtrl: NavController, public platform: Platform) {

    }

    async ngOnInit() {
        this.returnPage = await this.storage.getItem('page');
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.loadCart();
    }

    async loadCart() {
        this.cartItems = await this.storage.getItem('cart');
        this.cartItems.forEach(element => {
            if (element.item.availability.type === 'En Magasin') {
                element.item.availability.feed = 0;
            }
            this.imgURL = element.item.pictures[0];
            // @ts-ignore
            this.total += element.item.availability.feed + element.amount * element.qty;
        });
    }

    async remove(index: number, item: itemCart) {
        item.qty -= 1;
        const mytotal: number = item.amount;
        if (item.qty === 0) {
            this.cartItems.splice(index, 1);
            await this.storage.remove('cart').then(res => {
                this.presentToast('Item removed', 2000);
            });
        }
        await this.storage.setItem('cart', this.cartItems);
        this.total -= mytotal;
        this.cartItemCount.next(this.cartItemCount.value - 1);
    }

    async add(item: itemCart) {
        item.qty += 1;
        const mytotal: number = item.amount;
        // const mytotal: number = (item.qty * item.amount);
        await this.storage.setItem('cart', this.cartItems);
        this.total += mytotal;
        this.cartItemCount.next(this.cartItemCount.value + 1);
    }

    removeProduct(item: itemCart) {
        // for (let [index, p] of this.cartItems.entries()) {
        //     if (p.item._id === item.item._id) {
        //         this.cartItemCount.next(this.cartItemCount.value - p.amount);
        //         this.cartItems.splice(index, 1);
        //     }
        // }
    }

    async presentToast(message: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message,
            duration
        });
        await toast.present();
    }

    contact(item: itemCart) {
        if (this.utilisateur._id === item.item.utilisateurId) {
            this.presentToast('Vous etes le proprietaire du produit', 2000);
        } else {
            this.navCtrl.navigateForward(`/action-message/${1000}/write/${item.item.utilisateurId}`);
        }
    }

    about(param) {
        this.navCtrl.navigateForward('/about/' + param);
    }

    checkout(param: string) {
        const params = JSON.stringify({paymentAmount: this.total, currency: 'usd', currencyIcon: '$'});
        if (param === 'cc') {
            this.navCtrl.navigateForward('/stripe-web/' + params);
        } else if (param === 'paypal') {
            if (this.platform.is('ios') || this.platform.is('android')) {
                this.navCtrl.navigateForward('/paypal/' + params);
            } else {
                this.navCtrl.navigateForward('/paypal-web/' + params);
            }
        }
    }
}
