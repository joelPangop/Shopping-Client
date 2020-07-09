import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {itemCart} from '../../models/itemCart-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {LoadingController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {Utilisateur} from '../../models/utilisateur-interface';
import {BehaviorSubject, Subject} from 'rxjs';
import {StorageService} from '../../services/storage.service';
import {CheckoutPage} from '../checkout/checkout.page';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Storage} from '@ionic/storage';
import {CommandeService} from '../../services/commande.service';
import {Commande} from '../../models/commande-interface';
import {CartService} from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

    cartItems: itemCart[] = [];
    total = 0;
    returnPage: string;
    utilisateur = {} as Utilisateur;
    cartItemCount: BehaviorSubject<number> = new BehaviorSubject(0);
    imgURL: any;
    commande = {} as Commande;
    @ViewChild('cart', {static: false, read: ElementRef}) fab: ElementRef;

    constructor(private storage: Storage, private toastCtrl: ToastController, public modalController: ModalController,
                private navCtrl: NavController, public platform: Platform, public storageService: StorageService,
                private userStorageUtils: UserStorageUtils, private nativeStorage: NativeStorage, private cartService: CartService,
                private cmdService: CommandeService, private  loadCtrl: LoadingController) {

    }

    async ngOnInit() {
        // this.returnPage = await this.storage.getItem('page');
        this.utilisateur = await this.userStorageUtils.getUser();
        this.loadCart();
    }

    async loadCart() {
        // this.cartItems = await this.storage.getItem('cart');
        if (this.utilisateur._id) {
            this.cmdService.loadCommande(this.utilisateur).subscribe((res) => {
                if (res) {
                    this.cmdService.commande = res;
                    this.cartItems = this.cmdService.commande.itemsCart;
                    this.cartItems.forEach(element => {
                        if (element.item.availability.type === 'En Magasin') {
                            element.item.availability.feed = 0;
                        }
                        this.imgURL = element.item.pictures[0];
                        // @ts-ignore
                        this.total += element.item.availability.feed + element.amount;
                    });
                }
            });
        } else {
            this.cartItems = await this.storage.get('cart');
            if (this.cartItems) {
                this.cartItems.forEach(element => {
                    if (element.item.availability.type === 'En Magasin') {
                        element.item.availability.feed = 0;
                    }
                    this.imgURL = element.item.pictures[0];
                    // @ts-ignore
                    this.total += element.item.availability.feed + element.amount;
                });
            }else{
                this.cartItems = [];
            }
        }
    }

    // // Get Cart Items From Storage
    // getCartItems() {
    //     this.storageService.getStorage('my-cart').then((products) => {
    //         this.cartItems = products;
    //         for (var i = 0; i < this.cartProducts.length; i++) {
    //             this.total += this.cartProducts[i].discountPrice * this.cartProducts[i].quantity;
    //         }
    //     });
    // }
    // Add More Quantity
    async addQuantity(product, index) {
        if (product.qty) {
            product.qty = product.qty + 1;
        } else {
            product.qty = 1;
            product.qty = product.qty + 1;
        }
        // this.total = this.total + product.discountPrice;
        this.total = this.total + product.item.price;
        product.amount = product.amount + product.item.price;
        // await this.storage.set('cart', this.cartItems);
        this.cartItemCount.next(this.cartItemCount.value + 1);

        this.cmdService.commande.itemsCart = this.cartItems;
        let totalAmount = 0;
        for (let c of this.cartItems) {
            totalAmount += c.amount;
        }
        this.cmdService.commande.amount = totalAmount;
        const loading = await this.loadCtrl.create({
            message: 'Please wait...'
        });
        await loading.present();

        this.cmdService.updateCommande().subscribe(async (res) => {
            this.cmdService.commande = res.article;
            await this.storage.set('cart', this.cmdService.commande);
            console.log('result', res.result);
            if (res.result === 'successfull') {
                await loading.dismiss();
            }
        });
    }

    // // Remove Product From Cart
    // removeProduct(product, index) {
    //     this.cartProducts.splice(index, 1);
    //     this.storageService.removeStorageValue(product.id, 'my-cart');
    //     this.getCartItems();
    //     this.total = this.total - (product.discountPrice * product.quantity);
    // }
    // async remove(index: number, item: itemCart) {
    //     item.qty -= 1;
    //     const mytotal: number = item.amount;
    //     if (item.qty === 0) {
    //         this.cartItems.splice(index, 1);
    //         await this.storage.remove('cart').then(res => {
    //             this.presentToast('Item removed', 2000);
    //         });
    //     }
    //     await this.storage.set('cart', this.cartItems);
    //     // await this.storage.setItem('cart', this.cartItems);
    //     this.total -= mytotal;
    //     this.cartItemCount.next(this.cartItemCount.value - 1);
    // }

    // Minus Product Quantity
    async minusQuantity(product, index) {
        if (product.qty > 1) {
            product.qty = product.qty - 1;
            this.total = this.total - product.item.price;
            product.amount = product.amount - product.item.price;
            this.cmdService.commande.itemsCart = this.cartItems;
            let totalAmount = 0;
            for (let c of this.cartItems) {
                totalAmount += c.amount;
            }
            this.cmdService.commande.amount = totalAmount;
            this.cmdService.commande.quantity = this.cartItems.length;
            const loading = await this.loadCtrl.create({
                message: 'Please wait...'
            });
            await loading.present();
            this.cmdService.updateCommande().subscribe(async (res) => {
                this.cmdService.commande = res.article;
                await this.storage.set('cart', this.cmdService.commande);
                console.log('result', res.result);
                if (res.result === 'successfull') {
                    await loading.dismiss();
                }
            });
            // this.cartItemCount.next(this.cartItemCount.value - 1);
        }

    }

    // async add(item: itemCart) {
    //     item.qty += 1;
    //     const mytotal: number = item.amount;
    //     // const mytotal: number = (item.qty * item.amount);
    //     await this.storage.set('cart', this.cartItems);
    //     // await this.storage.setItem('cart', this.cartItems);
    //     this.total += mytotal;
    //
    //     this.cartItemCount.next(this.cartItemCount.value + 1);
    // }

    async removeProduct(item: itemCart, index) {
        const loading = await this.loadCtrl.create({
            message: 'Please wait...'
        });
        await loading.present();
        for (let it of this.cartItems) {
            if (it.item._id === item.item._id) {
                // this.cartItemCount.next(this.cartItemCount.value - 1);
                this.cartItems.splice(index, 1);
                this.cartService.setCartItemCount(this.cartItems.length);
                this.total = this.total - (item.qty * item.amount);
                // this.event.publish('cartItemCount', this.cartItems.length);
                await this.storage.set('cart', this.cartItems);
            }
        }
        if (this.cartItems.length === 0) {
            this.cmdService.deleteCommande().subscribe(async (res) => {
                console.log('result', res);
                await loading.dismiss();
            });
        } else {
            this.cmdService.commande.itemsCart = this.cartItems;
            let totalAmount = 0;
            for (let c of this.cartItems) {
                totalAmount += c.amount;
            }
            this.cmdService.commande.amount = totalAmount;
            this.cmdService.commande.quantity = this.cartItems.length;
            this.cmdService.updateCommande().subscribe(async (res) => {
                this.cmdService.commande = res.article;
                await this.storage.set('cart', this.cmdService.commande);
                console.log('result', res.result);
                if (res.result === 'successfull') {
                    await loading.dismiss();
                }
                this.presentToast('Votre panier a ete mis a jour', 2000);
            });
        }
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
            this.navCtrl.navigateForward(`/action-message/${1000}/write/${item.item.utilisateurId}/${item.item._id}`);
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

    // Go to checkout page
    async goToCheckout() {
        this.dismiss();
        const modal = await this.modalController.create({
            component: CheckoutPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    // Back to previous page options
    dismiss() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    async presentLoadingDefault() {

        const loading = await this.loadCtrl.create({
            message: 'Please wait...'
        });

        await loading.present();

        setTimeout(() => {
            loading.dismiss();
        }, 5000);
    }
}
