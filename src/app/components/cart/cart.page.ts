import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {itemCart} from '../../models/itemCart-interface';
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
import {AuthService} from '../../services/auth.service';
import {CurrencyService} from '../../services/currency.service';
import {environment} from '../../models/environements';
import {PaymentService} from '../../services/payment.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavigationExtras, Router} from '@angular/router';

// @ts-ignore
const {getCodes, getData, getNameList, getCodeList} = require('country-list');

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
    taxAmount: number;
    url = environment.api_url;
    steps: any[] = [];
    addrForm: FormGroup;
    user_informations: any;

    @ViewChild('cart', {static: false, read: ElementRef}) fab: ElementRef;

    constructor(private storage: StorageService, private toastCtrl: ToastController, public modalController: ModalController,
                private navCtrl: NavController, public platform: Platform, public storageService: StorageService,
                private userStorageUtils: UserStorageUtils, public cartService: CartService, public autSrv: AuthService,
                public cmdService: CommandeService, private  loadCtrl: LoadingController, public cuService: CurrencyService,
                private paymentService: PaymentService, public formBuilder: FormBuilder, private router: Router) {
        this.cartItemCount = this.cartService.getCartItemCount();
    }

    async ngOnInit() {
        // this.returnPage = await this.storage.getItem('page');
        this.utilisateur = await this.autSrv.currentUser;
        this.loadCart();
        console.log(getCodes());
        console.log(getData());
        console.log(getCodeList());
        console.log(getNameList());
        this.steps = [
            {
                step: 'Card',
                isSelected: true
            },
            {
                step: 'Billing',
                isSelected: false
            }
        ];

        this.addrForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            addr_1: ['', [Validators.required]],
            addr_2: [''],
            app: [''],
            phone: [''],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            zipcode: ['', [Validators.required]],
        });
    }

    async loadCart() {
        // this.cartItems = await this.storage.getItem('cart');
        if (this.utilisateur._id) {
            this.cmdService.loadCheckoutCommande(this.utilisateur).subscribe((res) => {
                if (res) {
                    this.cmdService.commande = res;
                    this.cartService.cartItems = this.cmdService.commande.itemsCart;
                    this.cartService.cartItems.forEach(element => {
                        if (element.item.availability.type === 'En Magasin') {
                            element.item.availability.feed = 0;
                        }
                        this.imgURL = element.item.pictures[0];
                        // @ts-ignore
                        this.cartService.total += element.item.availability.feed + element.amount;
                    });
                    this.cartService.taxAmount = this.cartService.total * 0.1;
                }
            });
        } else {
            await this.storage.getObject('cart').then((res: any) => {
                if(res){
                    this.cartService.cartItems = res.itemsCart;
                } else {
                    this.cartService.cartItems = [];
                }

                if (this.cartService.cartItems) {
                    this.cartService.cartItems.forEach(element => {
                        if (element.item.availability.type === 'En Magasin') {
                            element.item.availability.feed = 0;
                        }
                        this.imgURL = element.item.pictures[0];
                        // @ts-ignore
                        this.cartService.total += element.item.availability.feed + element.amount;
                    });
                    this.cartService.taxAmount = this.cartService.total * 0.1;
                } else {
                    this.cartService.cartItems = [];
                }
            });
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
        this.cartService.total = this.cartService.total + product.item.price;
        product.amount = product.amount + product.item.price;
        // await this.storage.set('cart', this.cartItems);
        this.cartService.setCartItemCount(product.qty);

        this.cmdService.commande.itemsCart = this.cartService.cartItems;
        let totalAmount = 0;
        for (let c of this.cartService.cartItems) {
            totalAmount += c.amount;
        }
        this.cartService.taxAmount = this.cartService.total * 0.1;
        this.cmdService.commande.amount = totalAmount;
        const loading = await this.loadCtrl.create({
            message: 'Please wait...'
        });
        await loading.present();

        if (this.utilisateur._id) {
            this.cmdService.updateCommande().subscribe(async (res) => {
                this.cmdService.commande = res.article;
                await this.storage.setObject('cart', this.cmdService.commande);
                console.log('result', res.result);
                if (res.result === 'successfull') {
                    await loading.dismiss();
                }
            });
        } else {
            await this.storage.setObject('cart', this.cmdService.commande);
            await loading.dismiss();
        }
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
            this.cartService.total = this.cartService.total - product.item.price;
            product.amount = product.amount - product.item.price;
            this.cmdService.commande.itemsCart = this.cartService.cartItems;
            let totalAmount = 0;
            for (let c of this.cartService.cartItems) {
                totalAmount += c.amount;
            }
            this.cartService.taxAmount = this.cartService.total * 0.1;
            this.cmdService.commande.amount = totalAmount;
            this.cmdService.commande.quantity = this.cartService.cartItems.length;
            const loading = await this.loadCtrl.create({
                message: 'Please wait...'
            });
            await loading.present();
            if (this.utilisateur._id) {
                this.cmdService.updateCommande().subscribe(async (res) => {
                    this.cmdService.commande = res.article;
                    await this.storage.setObject('cart', this.cmdService.commande);
                    console.log('result', res.result);
                    if (res.result === 'successfull') {
                        await loading.dismiss();
                    }
                });
            } else {
                await this.storage.setObject('cart', this.cmdService.commande);
                await loading.dismiss();
            }
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
        this.cartService.removeProduct(item, index, this.utilisateur).then((res) => {
            this.presentToast(res, 2000);
        });
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
        const params = JSON.stringify({paymentAmount: this.total, currency: this.utilisateur.currency.currency});
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
        // const modal = await this.modalController.create({
        //     component: CheckoutPage,
        //     cssClass: 'cart-modal',
        //     componentProps: {
        //         totalAmount: this.total + this.taxAmount
        //     }
        // });
        // return await modal.present();
        const navigationExtras: NavigationExtras = {
            queryParams: {
                totalAmount: this.cartService.total + this.cartService.taxAmount
            }
        };
        await this.router.navigate(['menu/tabs/checkout'], navigationExtras);
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

    getRatedPrice(price: number, rate: number) {
        const retour = price * rate;
        return retour;
    }

    use_information_toggle() {
        if (this.user_informations) {
            this.addrForm.get('name').setValue(this.utilisateur.userInfo.firstName + ' ' + this.utilisateur.userInfo.lastName);
            this.addrForm.get('addr_1').setValue(this.utilisateur.userInfo.address.roadName);
            this.addrForm.get('app').setValue(this.utilisateur.userInfo.address.appartNumber);
            this.addrForm.get('city').setValue(this.utilisateur.userInfo.address.town);
            this.addrForm.get('phone').setValue(this.utilisateur.userInfo.telephones[0].numeroTelephone);
            this.addrForm.get('state').setValue(this.utilisateur.userInfo.address.region);
            this.addrForm.get('zipcode').setValue(this.utilisateur.userInfo.address.postalCode);
        } else {
            this.addrForm.get('name').setValue('');
            this.addrForm.get('addr_1').setValue('');
            this.addrForm.get('app').setValue('');
            this.addrForm.get('city').setValue('');
            this.addrForm.get('phone').setValue('');
            this.addrForm.get('state').setValue('');
            this.addrForm.get('zipcode').setValue('');
        }
    }

    back() {
        if (this.steps[1].isSelected) {
            this.steps[0].isSelected = true;
            this.steps[1].isSelected = false;
        }
    }

    next() {
        if (this.steps[0].isSelected) {
            this.steps[1].isSelected = true;
            this.steps[0].isSelected = false;
        }
    }
}
