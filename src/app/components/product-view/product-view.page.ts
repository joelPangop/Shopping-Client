import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Article} from '../../models/article-interface';
import {StorageService} from '../../services/storage.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {ArticleService} from '../../services/article.service';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {Utilisateur} from '../../models/utilisateur-interface';
import {CartPage} from '../cart/cart.page';
import {itemCart} from '../../models/itemCart-interface';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {CommandeService} from '../../services/commande.service';
import {Commande} from '../../models/commande-interface';
import {CartService} from '../../services/cart.service';
import {Notification} from '../../models/notification-interface';
import {NotificationType} from '../../models/notificationType';

@Component({
    selector: 'app-product-view',
    templateUrl: './product-view.page.html',
    styleUrls: ['./product-view.page.scss'],
})
export class ProductViewPage implements OnInit {

    utilisateur = {} as Utilisateur;

    product = {} as Article;

    currency: any;

    rate: any;
    public cartItemCount;
    commande = {} as Commande;
    like: boolean = false;

    // Slider Options
    slideOpts = {
        initialSlide: 0,
        loop: true,
        autoplay: true,
        speed: 400,
        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
        },
    };

    @ViewChild('cart', {static: false, read: ElementRef}) fab: ElementRef;

    constructor(public modalController: ModalController, private storageService: StorageService,
                private userStorageUtils: UserStorageUtils, public articleService: ArticleService,
                public navParams: NavParams, private toastCtrl: ToastController, private storage: Storage,
                private cartService: CartService, private cmdService: CommandeService) {
        this.product = this.navParams.data as Article;
    }

    async ngOnInit() {
        this.utilisateur = await this.userStorageUtils.getUser();
        this.product = this.navParams.data as Article;
        this.like = this.product.likes.includes(this.utilisateur._id);
        this.currency = this.utilisateur.currency.currency;
        let data: Commande;

        this.cmdService.loadCommande(this.utilisateur).subscribe((res) => {
            {
                data = res;
                this.cartItemCount = new BehaviorSubject(data ? data.itemsCart.length : 0);
            }
        });

        if (this.utilisateur._id) {
            this.cmdService.loadCommande(this.utilisateur).subscribe((data) => {
                if(data){
                    this.commande = data;
                }else {
                    this.commande = {} as Commande;
                }
            });
        } else {
            this.commande = await this.storage.get('cart') as Commande;
        }
    }

    // Add to Cart Function
    async addToCart() {
        // Save cart product in storage
        // let itemCart: itemCart = {
        //     item : this.product,
        //     qty: 1,
        //     amount: this.product.price
        // };
        // await this.storageService.setStorageValue(itemCart, 'cart');
        if (this.utilisateur._id == this.product.utilisateurId) {
            this.presentToast('Vous ne pouvez pas ajouter votre propre article a la cart', 2000);
        } else {
            try {
                let data: itemCart[];
                let added = false;

                data = this.commande.itemsCart ? this.commande.itemsCart : [];
                console.log('data', data);
                // on vérifie si le panier est vide
                if (data === null || data.length === 0) {
                    data = [];
                    data.push({
                        item: this.product,
                        qty: 1,
                        amount: this.product.price
                    });
                    this.cartItemCount.next(this.cartItemCount.value + 1);
                    const timestamp = new Date().getUTCMilliseconds();
                    let ran_number = this.getRandomInt() + timestamp + this.getRandomInt();
                    this.cmdService.commande.num_commande = ran_number;
                    this.cmdService.commande.itemsCart = data;
                    this.cmdService.commande.completed = false;
                    this.cmdService.commande.userId = this.utilisateur._id;
                    this.cmdService.commande.amount = this.product.price;
                    this.cmdService.commande.shipmentFee = 0;
                    this.cmdService.commande.quantity = data.length;
                    this.cmdService.createCommande().subscribe(async res => {
                        console.log('resultat', res);
                        this.cmdService.commande = res;
                        await this.storage.set('cart', this.cmdService.commande);
                    });
                    // this.event.publish('cartItemCount', this.cartItemCount.value);
                    this.cartService.setCartItemCount(this.cartItemCount.value);
                } else {
                    // tslint:disable-next-line:prefer-const
                    let names: string[] = [];
                    data.forEach(d => {
                        names.push(d.item.title);
                    });
                    if (!names.includes(this.product.title)) {
                        data.push({
                            item: this.product,
                            qty: 1,
                            amount: this.product.price
                        });
                        this.cartItemCount.next(this.cartItemCount.value + 1);
                        // this.event.publish('cartItemCount', this.cartItemCount.value);
                        this.cartService.setCartItemCount(this.cartItemCount.value);
                    } else {
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < data.length; i++) {
                            const element: itemCart = data[i];
                            if (this.product._id === element.item._id) {
                                // le panier contient déjà cette article
                                element.qty += 1;
                                element.amount += this.product.price;
                                added = true;
                            }
                        }
                    }
                    this.cmdService.commande.itemsCart = data;
                    this.cmdService.commande.userId = this.utilisateur._id;
                    let amount = 0;
                    for (let i of data) {
                        amount += i.amount;
                    }
                    this.cmdService.commande.amount = amount;
                    this.cmdService.commande.quantity = data.length;
                    this.cmdService.updateCommande().subscribe(async res => {
                        console.log('resultat', res);
                        this.cmdService.commande = res;
                        await this.storage.set('cart', this.cmdService.commande);
                    });
                }
                // if (!added) {
                //     // le panier n'est pas vide et ne contient pas l'article
                //     data.push({
                //         item,
                //         qty: 1,
                //         amount: item.price
                //     });
                // }
                // await this.storage.set('commande', data);
                this.animateCSS('tada');
                this.presentToast('Votre panier a été mis à jour', 1500);
            } catch (e) {
                const myData: itemCart[] = [];
                console.log('error', e);
                if (e.code === 2) {
                    myData.push({
                        item: this.product,
                        qty: 1,
                        amount: this.product.price
                    });
                    await this.storage.set('cart', myData);
                    this.presentToast('Votre panier a été mis à jour', 1500);
                }
            }
        }
    }

    // Back to previous page function
    dismiss() {
        this.modalController.dismiss({
            dismissed: true,
            article: this.product
        });
    }

    async gotoCartPage() {
        this.dismiss();
        this.animateCSS('bounceOutLeft', true);
        const modal = await this.modalController.create({
            component: CartPage,
            cssClass: 'cart-modal'
        });
        modal.onWillDismiss().then(() => {
            this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft');
            this.animateCSS('bounceInLeft');
        });
        return await modal.present();
    }

    onModelChange($event) {
        console.log('event', $event);
    }

    // Voici la methode pour laisser une note à un article
    async leaveNote() {
        const utilisateurId: string = this.product.utilisateurId;
        if (utilisateurId === this.utilisateur._id) {
            this.presentToast('Impossible de liker son propre article', 1500);
        } else {
            console.log('rate', this.rate);
            // on stocke la moyenne dans 'average'
            const average: number = (this.product.averageStar + this.rate) / 2;
            // on arrondi 'average' et on stocke le résultat dans 'aroundi'
            const aroundi: number = Math.ceil(average);
            const utilisateurId: string = this.product.utilisateurId;
            const articleId: string = this.product._id;

            await this.articleService.leaveNote(utilisateurId, articleId, {averageStar: aroundi})
                .subscribe(res => {
                    this.product = res as Article;
                    this.presentToast('Votre note a réussi !', 2000);
                });
        }
    }

    //  on affiche un message toast grace à cette methode
    async presentToast(message: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message,
            duration
        });
        await toast.present();
    }

    animateCSS(animationName, keepAnimated = false) {
        const node = this.fab.nativeElement;
        node.classList.add('animated', animationName);

        //https://github.com/daneden/animate.css
        function handleAnimationEnd() {
            if (!keepAnimated) {
                node.classList.remove('animated', animationName);
            }
            node.removeEventListener('animationend', handleAnimationEnd);
        }

        node.addEventListener('animationend', handleAnimationEnd);
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(300000000));
    }

    async checkLike() {
        const utilisateurId: string = this.product.utilisateurId;
        if (utilisateurId === this.utilisateur._id) {
            this.presentToast('Impossible de liker son propre article', 1500);
        } else {
            this.like = !this.like;
            if (this.like === false) {
                const index = this.product.likes.indexOf(this.utilisateur._id, 0);
                this.product.likes.splice(index, 1);
            } else {
                this.product.likes.push(this.utilisateur._id);
            }

            await this.articleService.checkLike(utilisateurId, this.product._id, this.product).subscribe(res => {
                console.log(res);
                const notification: Notification = {
                    title: 'Nouveaux Like',
                    message: this.utilisateur.username + ' a like votre article',
                    utilisateurId: utilisateurId,
                    article: this.product,
                    avatar: this.product.pictures[0],
                    read: false,
                    type: NotificationType.LIKE,
                    sender: this.utilisateur._id
                };
                // setTimeout(async () => {
                //     if (this.like === true) {
                //         this.msgService.addNotification(notification).subscribe(res => {
                //             this.socket.emit('notifying', {
                //                 user: this.utilisateur,
                //                 message: this.utilisateur.username + ' a like votre article'
                //             });
                //         });
                //     }
                // }, 10000);
            });
        }
    }
}