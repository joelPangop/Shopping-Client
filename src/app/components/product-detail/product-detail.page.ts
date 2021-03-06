import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Article} from '../../models/article-interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoadingController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {itemCart} from '../../models/itemCart-interface';
import {ArticleService} from '../../services/article.service';
import {ImageService} from '../../services/image.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {CartPage} from '../cart/cart.page';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Notification} from '../../models/notification-interface';
import {NotificationType} from '../../models/notificationType';
import {MessageService} from '../../services/message.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {CurrencyService} from '../../services/currency.service';
import {environment} from '../../models/environements';
import {CommandeService} from '../../services/commande.service';
import {Commande} from '../../models/commande-interface';
import {CartService} from '../../services/cart.service';
import {LandingPagePage} from '../auth/landing-page/landing-page.page';
import {AuthService} from '../../services/auth.service';
import {Plugins} from '@capacitor/core';
import * as PluginsLibrary from 'capacitor-video-player';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {StorageService} from '../../services/storage.service';
import {WebsocketService} from '../../services/websocket.service';
import {OrderStatus} from '../../models/OrderStatus';
import {itemStatus} from '../../models/itemStatus';

const {CapacitorVideoPlayer, Device} = Plugins;

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.page.html',
    styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

    id;
    article = {} as Article;
    rate: any;
    categories;
    cities;
    url = environment.api_url;
    // Slider Options
    slideOpts = {
        speed: 1000,
        slidesPerView: 1,
        zoom: {
            maxRatio: 5,
        },
        spaceBetween: 25,
        autoplay: {
            delay: 4000
        }
    };

    webSocket: WebSocket;
    cartItems = [] as itemCart[];
    images: any;
    public cartItemCount = new BehaviorSubject<number>(0);
    utilisateur = {} as Utilisateur;
    like: boolean = false;
    currency: any;
    product = {} as Article;
    page: string = '';
    data: itemCart[] = [];
    added = false;

    @ViewChild('cart', {static: false, read: ElementRef}) fab: ElementRef;

    private resultRate: string = '0.1';

    constructor(private activatedRoute: ActivatedRoute, private photoViewer: PhotoViewer, private navCtrl: NavController,
                private storage: StorageService, private imageService: ImageService, private sharing: SocialSharing, public authService: AuthService,
                private toastCtrl: ToastController, public platform: Platform, public articleService: ArticleService, private streamingVideo: StreamingMedia,
                public modalController: ModalController, private msgService: MessageService, private cmdService: CommandeService, private websocketService: WebsocketService,
                private userStorageUtils: UserStorageUtils, private cartService: CartService, public cuService: CurrencyService,
                private router: Router, private loadingCtrl: LoadingController) {
        this.cartItemCount = this.cartService.getCartItemCount();
        this.article = {} as Article;
        this.loadArticle();
    }

    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.utilisateur = await this.authService.currentUser;
        console.log(this.id);
        let data: Commande;
        this.cmdService.loadCheckoutCommande(this.utilisateur).subscribe((res) => {
            {
                if (res) {
                    data = res;
                    this.cartService.setCartItemCount(data ? data.itemsCart.length : 0);
                }
            }
        });
        await this.loadArticle();
        if (this.utilisateur._id) {
            this.cmdService.loadCheckoutCommande(this.utilisateur).subscribe((res) => {
                if (res) {
                    if (res) {
                        this.cmdService.commande = res;
                        this.data = this.cmdService.commande.itemsCart;
                    }
                }
                console.log('data', data);
            });
        } else {
            await this.storage.getObject('cart').then((res: any) => {
                if (res) {
                    this.cmdService.commande = res as Commande;
                    this.data = this.cmdService.commande.itemsCart;
                }
            });
        }
        if (!this.rate) {
            this.rate = 0;
        }
    }

    videoPlayer: any;

    public async ionViewWillEnter() {
        const info = await Device.getInfo();
        console.log(info);
        this.views = this.article.views;
        if (info.platform === 'ios' || info.platform === 'android') {
            this.videoPlayer = CapacitorVideoPlayer;
        } else {
            this.videoPlayer = PluginsLibrary.CapacitorVideoPlayer;
        }
    }

    views = 0;

    public async ionViewDidEnter() {
        await this.loadArticle();
        setTimeout(async () => {
            if (this.article.utilisateurId !== this.authService.currentUser._id) {
                this.article.views++;
                console.log('views', this.article.views);
            }
        }, 5000);
    }

    public async ionViewDidLeave() {
        if (this.article.utilisateurId !== this.authService.currentUser._id) {
            const utilisateurId: string = this.article.utilisateurId;
            const articleId: string = this.id;

            this.articleService.addView(utilisateurId, articleId, {views: this.article.views}).subscribe(res => {
                this.article = res as Article;
            });
            console.log('views', this.article.views);
        }
    }

    // @ts-ignore
    async loadArticle(): Observable<Article> {
        const loading = await this.loadingCtrl.create({
            message: 'Chargement...'
        });
        await loading.present();
        await this.articleService.loadArticle(this.id).subscribe(async (res) => {
            if (res) {
                this.article = res as Article;
                this.images = this.article.pictures;
                this.views = this.article.views;
                if (this.article.likes.includes(this.utilisateur._id)) {
                    this.like = true;
                }
            }
            await loading.dismiss();
        });
    }

    animateCSS(animationName, keepAnimated = false) {
        const node = this.fab.nativeElement;
        node.classList.add('animated', animationName);

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
        if (imgId.includes('jpg') || imgId.includes('jfif') || imgId.includes('png')) {
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
    }

    isImage(img: string): boolean {
        return img.includes('jpg') || img.includes('jpeg') || img.includes('png') || img.includes('jfif');
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
            .subscribe((res) => {
                if(res){
                    this.article = res as Article;
                    this.presentToast('Votre note a réussi !', 2000);
                }
            });
    }

    async checkLike() {
        const utilisateurId: string = this.article.utilisateurId;
        if (this.utilisateur._id) {
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

                this.articleService.checkLike(utilisateurId, this.id, this.article).subscribe(res => {
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
                            this.msgService.addNotification(notification).subscribe((res: any) => {
                                let not = res as Notification;
                                let res_str = JSON.stringify(not);
                                if (!this.websocketService.getWebSocket()) {
                                    console.log('No WebSocket connected :(');
                                    return;
                                }
                                this.websocketService.getWebSocket().send(res_str);
                                // this.userStorageUtils.getWebSocket().dispatchEvent('test')
                                this.msgService.loadAllNotifications(this.utilisateur._id).subscribe((res) => {
                                    console.log(res);
                                    this.msgService.setNotificationCount(res.length);
                                });
                            });
                        }
                    }, 1000);
                });
            }
        }
    }

    async gotoEdit() {
        this.articleService.article = this.article;
        await this.navCtrl.navigateRoot('menu/tabs/edit-product/' + this.article._id);
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
        // if (this.utilisateur._id) {
        if (this.utilisateur._id && this.utilisateur._id === this.article.utilisateurId) {
            this.presentToast('Vous ne pouvez pas ajouter votre propre article a la cart', 2000);
        } else {
            try {
                console.log('data', this.data);
                // on vérifie si le panier est vide
                // if (!data) {
                if (this.data === null || this.data.length === 0) {
                    this.data = [];
                    this.data.push({
                        item: this.article,
                        qty: 1,
                        amount: this.article.price,
                        status: itemStatus.ORDERED
                    });
                    this.cartItemCount.next(this.cartItemCount.value + 1);
                    const timestamp = new Date().getUTCMilliseconds();
                    let ran_number = this.getRandomInt() + timestamp + this.getRandomInt();
                    this.cmdService.commande.num_commande = ran_number;
                    this.cmdService.commande.itemsCart = this.data;
                    this.cmdService.commande.completed = false;
                    this.cmdService.commande.userId = this.utilisateur._id;
                    this.cmdService.commande.amount = this.article.price;
                    this.cmdService.commande.status = OrderStatus.CREATED;
                    this.cmdService.commande.quantity = this.data.length;
                    if(this.utilisateur._id){
                        this.cmdService.createCommande().subscribe(async res => {
                            console.log('resultat', res);
                            this.cmdService.commande = res;
                            await this.storage.setObject('cart', this.cmdService.commande);
                        });
                    } else {
                        await this.storage.setObject('cart', this.cmdService.commande);
                    }

                    // this.event.publish('cartItemCount', this.cartItemCount.value);
                    this.cartService.setCartItemCount(this.cartItemCount.value);
                } else {
                    // tslint:disable-next-line:prefer-const
                    let names: string[] = [];
                    this.data.forEach(d => {
                        names.push(d.item.title);
                    });
                    if (!names.includes(this.article.title)) {
                        this.data.push({
                            item: this.article,
                            qty: 1,
                            amount: this.article.price,
                            status: itemStatus.ORDERED
                        });
                        this.cartItemCount.next(this.cartItemCount.value + 1);
                        // this.event.publish('cartItemCount', this.cartItemCount.value);
                        this.cartService.setCartItemCount(this.cartItemCount.value);

                    } else {
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < this.data.length; i++) {
                            const element: itemCart = this.data[i];
                            if (this.article._id === element.item._id) {
                                // le panier contient déjà cette article
                                element.qty += 1;
                                element.amount += this.article.price;
                                this.added = true;
                            }
                        }
                    }
                    this.cmdService.commande.itemsCart = this.data;
                    this.cmdService.commande.userId = this.utilisateur._id;
                    let amount = 0;
                    for (let i of this.data) {
                        amount += i.amount;
                    }

                    this.cmdService.commande.amount = amount;
                    this.cmdService.commande.quantity = this.data.length;
                    if(this.utilisateur._id){
                        this.cmdService.updateCommande().subscribe(async res => {
                            console.log('resultat', res);
                            this.cmdService.commande = res;
                            await this.storage.setObject('cart', this.cmdService.commande);
                        });
                    } else {
                        await this.storage.setObject('cart', this.cmdService.commande);
                    }
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
                // });

            } catch (e) {
                const myData: itemCart[] = [];
                console.log('error', e);
                if (e.code === 2) {
                    myData.push({
                        item: this.article,
                        qty: 1,
                        amount: this.article.price,
                        status: itemStatus.ORDERED
                    });
                    await this.storage.setObject('cart', myData);
                    this.presentToast('Votre panier a été mis à jour', 1500);
                }
            }
        }
        // } else {
        //     this.dismiss();
        //     const modal = await this.modalController.create({
        //         component: LandingPagePage,
        //         cssClass: 'cart-modal'
        //     });
        //     return await modal.present();
        // }
    }

    // Back to previous page options
    dismiss() {
        this.modalController.dismiss({
            'dismissed': true
        });
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
        await toast.present();
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

    async contact() {
        this.dismiss();
        if (this.utilisateur._id) {
            if (this.utilisateur._id === this.article.utilisateurId) {
                this.presentToast('Vous etes le proprietaire du produit', 2000);
            } else {
                await this.navCtrl.navigateForward(`menu/tabs/action-message/${1000}/write/${this.article.utilisateurId}/${this.article._id}`);
            }
        } else {
            const modal = await this.modalController.create({
                component: LandingPagePage,
                cssClass: 'cart-modal'
            });
            return await modal.present();
        }
    }

    contains(target: string[], pattern: string[]) {
        let value = false;
        if (target) {
            pattern.forEach(function(word) {
                // @ts-ignore
                value = value + target.includes(word);
            });
        }
        return value;
    }

    async openModal(files: any) {
        console.log(files);
        if (files.includes('mp4')) {
            let options: StreamingVideoOptions = {
                successCallback: () => {
                    console.log();
                },
                errorCallback: () => {
                    console.log();
                },
                orientation: 'portrait'
            };

            this.streamingVideo.playVideo(files, options);

            // const modal = document.getElementById('myModal');
            // modal.style.display = 'block';
            //
            // const $source: any = document.getElementById('video_here');
            // $source.src = URL.createObjectURL(files);
            // $source.parentElement.load();
            // const modal = await this.modalController.create({
            //     component: PreviewVideoPage,
            //     cssClass: 'cart-modal',
            //     componentProps: {
            //         files: files,
            //     }
            // });
            // return await modal.present();
        }
    }

    getRatedPrice(price: number, rate: number) {
        const retour = price * rate;
        return retour;
    }
}
