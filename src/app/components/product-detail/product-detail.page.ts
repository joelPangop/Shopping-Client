import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Article} from '../../models/article-interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {itemCart} from '../../models/itemCart-interface';
import {FormGroup} from '@angular/forms';
import {ArticleService} from '../../services/article.service';
import {ImageService} from '../../services/image.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {CartPage} from '../cart/cart.page';

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
    slidesOpt = {
        speed: 1000,
        autoplay: {
            delay: 500
        }
    };
    cartItems: itemCart[];
    images: any;
    public cartItemCount = new BehaviorSubject(0);

    @ViewChild('cart', {static: false, read: ElementRef}) fab: ElementRef;

    constructor(private activatedRoute: ActivatedRoute, private photoViewer: PhotoViewer, private navCtrl: NavController,
                private storage: NativeStorage, private imageService: ImageService, private sharing: SocialSharing,
                private toastCtrl: ToastController, public platform: Platform, public articleService: ArticleService,
                public modalController: ModalController) {
    }

    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        await this.storage.getItem('cart').then(res => {
            this.cartItems = res;
            this.cartItemCount.next(this.cartItems.length);
        });
        console.log(this.id);
        await this.loadArticle();
        if (!this.rate) {
            this.rate = 0;
        }
    }

    // @ts-ignore
    loadArticle(): Observable<Article> {
        this.articleService.loadArticle(this.id).subscribe(res => {
            this.articleService.article = res as Article;
            this.images = this.articleService.article.pictures;
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
                    this.articleService.article.title,
                    null,
                    null,
                    `https://example.com/product-detail/${this.articleService.article._id}`
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
            this.photoViewer.show(`http://10.103.4.78:4000/image/${imgId}`,
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
        const average: number = (this.articleService.article.averageStar + this.rate) / 2;
        // on arrondi 'average' et on stocke le résultat dans 'aroundi'
        const aroundi: number = Math.ceil(average);
        const utilisateurId: string = this.articleService.article.utilisateurId;
        const articleId: string = this.id;

        await this.articleService.leaveNote(utilisateurId, articleId, {averageStar: aroundi})
            .subscribe(res => {
                this.articleService.article = res as Article;
                this.presentToast('Votre note a réussi !', 2000);
            });
    }

//  grace à cette methode, on se déplace sur la page 'cart'
    async openCart() {
        await this.storage.setItem('page', 'product-detail/' + this.id);
        if (this.platform.is('ios') || this.platform.is('android')) {
            await this.navCtrl.navigateForward('/cart');
        } else {
            const modal = await this.modalController.create({
                component: CartPage,
                cssClass: '.my-custom-show-image'
            });
            modal.onWillDismiss().then(() => {
                this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft');
                this.animateCSS('bounceInLeft');
            });
            await modal.present();

        }

    }

    // methode pour ajouter un article au panier
    async addToCart(item: Article) {
        try {
            let data: itemCart[];
            let added = false;
            data = await this.storage.getItem('cart');
            console.log('data', data);
            // on vérifie si le panier est vide
            if (data === null || data.length === 0) {
                data.push({
                    item,
                    qty: 1,
                    amount: item.price
                });
            } else {
                // tslint:disable-next-line:prefer-const
                let names: string[] = [];
                data.forEach(d => {
                    names.push(d.item.title);
                });
                if (!names.includes(item.title)) {
                    data.push({
                        item,
                        qty: 1,
                        amount: item.price
                    });
                } else {
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < data.length; i++) {
                        const element: itemCart = data[i];
                        if (item._id === element.item._id) {
                            // le panier contient déjà cette article
                            element.qty += 1;
                            element.amount += item.price;
                            added = true;
                        }
                    }
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
            this.cartItemCount.next(this.cartItemCount.value + 1);
            await this.storage.setItem('cart', data);
            this.animateCSS('tada');
            this.presentToast('Votre panier a été mis à jour', 1500);
        } catch (e) {
            const myData: itemCart[] = [];
            console.log('error', e);
            if (e.code === 2) {
                myData.push({
                    item,
                    qty: 1,
                    amount: item.price
                });
                await this.storage.setItem('cart', myData);
                this.presentToast('Votre panier a été mis à jour', 1500);
            }
        }
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
            console.log('All product pictures', this.articleService.article.pictures);
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
