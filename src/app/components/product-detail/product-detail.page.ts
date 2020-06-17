import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Article} from '../../models/article-interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {itemCart} from '../../models/itemCart-interface';
import {ArticleService} from '../../services/article.service';
import {ImageService} from '../../services/image.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {CartPage} from '../cart/cart.page';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Notification} from '../../models/notification-interface';
import {NotificationType} from '../../models/notificationType';
import {MessageService} from '../../services/message.service';
import {Socket} from 'ngx-socket-io';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {CurrencyService} from '../../services/currency.service';
import {environment} from '../../models/environements';
import {CommandeService} from '../../services/commande.service';
import {Commande} from '../../models/commande-interface';
import {Storage} from '@ionic/storage';
import {CartService} from '../../services/cart.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.page.html',
    styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

    id;
    article: Article;
    rate: any;
    categories;
    cities;
    // Slider Options
    slideOpts = {
        speed: 1000,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
        },
        autoplay: {
            delay: 500
        }
    };

    cartItems: itemCart[];
    images: any;
    public cartItemCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    utilisateur = {} as Utilisateur;
    like: boolean = false;
    currency: any;

    @ViewChild('cart', {static: false, read: ElementRef}) fab: ElementRef;
    private resultRate: string = "0.1";

    constructor(private activatedRoute: ActivatedRoute, private photoViewer: PhotoViewer, private navCtrl: NavController,
                private storage: Storage, private imageService: ImageService, private sharing: SocialSharing,
                private toastCtrl: ToastController, public platform: Platform, public articleService: ArticleService,
                public modalController: ModalController, private msgService: MessageService, private socket: Socket,
                private userStorageUtils: UserStorageUtils, private cartService: CartService, public cuService: CurrencyService,
                private cmdService: CommandeService) {

    }

    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.utilisateur = await this.userStorageUtils.getUser();
        // this.cartItems = await this.storage.getItem('cart');
        // this.cartItemCount.next(this.cartItems.length);
        console.log(this.id);
        let data: Commande;

        this.cmdService.loadCommande(this.utilisateur).subscribe((res) => {{
            data = res;
            this.cartItemCount = new BehaviorSubject(data ? data.itemsCart.length : 0);
        }});
        await this.userStorageUtils.getCurrency().then(async res => {
            this.currency = res ? res.currency : this.utilisateur.currency.currency;
            await this.loadArticle();
        });

        if (!this.rate) {
            this.rate = 0;
        }
    }

    // @ts-ignore
    loadArticle(): Observable<Article> {
        this.articleService.loadArticle(this.id).subscribe(async res => {
            this.article = res as Article;
            this.images = this.article.pictures;
            const exchangeRate = await this.cuService.getExchangeRate(this.utilisateur.currency.currency, this.currency);
            let rate = exchangeRate[this.utilisateur.currency.currency + '_' + this.currency].val;
            this.article.price = this.article.price * parseFloat(rate);
            if (this.article.likes.includes(this.utilisateur._id)) {
                this.like = true;
            }
            // this.rate = this.articleService.article.averageStar;
        });
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

    //  Methode pour partager un article via les reseaux sociaux
    async share() {
        try {
            if (this.platform.is('ios') || this.platform.is('android')) {
                await this.sharing.share(
                    this.article.title,
                    null,
                    null,
                    `https://egoal-shopping.com/product-detail/${this.article._id}`
                );
            } else {
                await this.sharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
                    // Success!
                });
            }
            console.log('partage réussi !');
        } catch (e) {
            console.log('error', e);
        }
    }

    onModelChange($event) {
        console.log('event', $event);
    }

    // methode pour visionner une image avec option de partage
    async showImage(imgId: string, imgTitle: string) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            this.photoViewer.show(`${environment.api_url}/image/${imgId}`,
                imgTitle, {share: true});
        } else if (this.platform.is('desktop') || this.platform.is('hybrid')) {
            console.log('platform', this.platform.platforms());

            // const modal = await this.modalController.create({
            //
            //     cssClass: 'my-custom-show-image',
            //     componentProps: {
            //         image: imgId,
            //         title: this.articleService.article.title
            //     }
            // });
            // await modal.present();
        }
    }

    // Voici la methode pour laisser une note à un article
    async leaveNote() {
        console.log('rate', this.rate);
        // on stocke la moyenne dans 'average'
        const average: number = (this.article.averageStar + this.rate) / 2;
        // on arrondi 'average' et on stocke le résultat dans 'aroundi'
        const aroundi: number = Math.ceil(average);
        const utilisateurId: string = this.article.utilisateurId;
        const articleId: string = this.id;

        await this.articleService.leaveNote(utilisateurId, articleId, {averageStar: aroundi})
            .subscribe(res => {
                this.article = res as Article;
                this.presentToast('Votre note a réussi !', 2000);
            });
    }

    async checkLike() {
        const utilisateurId: string = this.article.utilisateurId;
        if (utilisateurId === this.utilisateur._id) {
            this.presentToast('Impossible de liker son propre article', 1500);
        } else {
            this.like = !this.like;
            if (this.like === false) {
                const index = this.article.likes.indexOf(this.utilisateur._id, 0);
                this.article.likes.splice(index, 1);
            } else {
                this.article.likes.push(this.utilisateur._id);
            }

            await this.articleService.checkLike(utilisateurId, this.id, this.article).subscribe(res => {
                console.log(res);
                const notification: Notification = {
                    title: 'Nouveaux Like',
                    message: this.utilisateur.username + ' a like votre article',
                    utilisateurId: utilisateurId,
                    article: this.article,
                    avatar: this.article.pictures[0],
                    read: false,
                    type: NotificationType.LIKE,
                    sender: this.utilisateur._id
                };
                setTimeout(async () => {
                    if (this.like === true) {
                        this.msgService.addNotification(notification).subscribe(res => {
                            this.socket.emit('notifying', {
                                user: this.utilisateur,
                                message: this.utilisateur.username + ' a like votre article'
                            });
                        });
                    }
                }, 10000);
            });
        }
    }

    async gotoCartPage() {
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

    // methode pour ajouter un article au panier
    async addToCart() {
        if (this.utilisateur._id == this.article.utilisateurId) {
            this.presentToast('Vous ne pouvez pas ajouter votre propre article a la cart', 2000);
        } else {
            try {
                let data: itemCart[];
                let added = false;
                let commande = await this.storage.get('cart') as Commande;
                data = commande ? commande.itemsCart : [];
                console.log('data', data);
                // on vérifie si le panier est vide
                if (data === null || data.length === 0) {
                    data = [];
                    data.push({
                        item: this.article,
                        qty: 1,
                        amount: this.article.price
                    });
                    this.cartItemCount.next(this.cartItemCount.value + 1);
                    const timestamp = new Date().getUTCMilliseconds();
                    let ran_number = this.getRandomInt() + timestamp + this.getRandomInt();
                    this.cmdService.commande.num_commande = ran_number;
                    this.cmdService.commande.itemsCart = data;
                    this.cmdService.commande.completed = false;
                    this.cmdService.commande.userId = this.utilisateur._id;
                    this.cmdService.commande.amount = this.article.price;
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
                    if (!names.includes(this.article.title)) {
                        data.push({
                            item: this.article,
                            qty: 1,
                            amount: this.article.price
                        });
                        this.cartItemCount.next(this.cartItemCount.value + 1);
                        // this.event.publish('cartItemCount', this.cartItemCount.value);
                        this.cartService.setCartItemCount(this.cartItemCount.value);

                    } else {
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < data.length; i++) {
                            const element: itemCart = data[i];
                            if (this.article._id === element.item._id) {
                                // le panier contient déjà cette article
                                element.qty += 1;
                                element.amount += this.article.price;
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
                        item: this.article,
                        qty: 1,
                        amount: this.article.price
                    });
                    await this.storage.set('cart', myData);
                    this.presentToast('Votre panier a été mis à jour', 1500);
                }
            }
        }
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(300000000));
    }

//  on affiche un message toast grace à cette methode
    async presentToast(message: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message,
            duration
        });
        toast.present();
    }

    async loadImages() {
        (await this.imageService.loadImages()).subscribe(data => {
            console.log('All data pictures', data);
            console.log('All product pictures', this.article.pictures);
            const tab = [];
            // @ts-ignore
            for (const img of data) {
                if (this.articleService.article.pictures.includes(img.filename)) {
                    tab.push(img);
                }
            }
            this.images = tab;
            console.log('images', this.images);
        });
    }

}
