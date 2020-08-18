import {Component, OnInit} from '@angular/core';
import {Article} from '../../models/article-interface';
import {BehaviorSubject} from 'rxjs';
import {Utilisateur} from '../../models/utilisateur-interface';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {MessageService} from '../../services/message.service';
import {Network} from '@ionic-native/network/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {ArticleService} from '../../services/article.service';
import {environment} from '../../models/environements';
import {itemCart} from '../../models/itemCart-interface';
import {CurrencyService} from '../../services/currency.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {ProductViewPage} from '../product-view/product-view.page';
import {CartPage} from '../cart/cart.page';
import {Storage} from '@ionic/storage';
import {Commande} from '../../models/commande-interface';
import {CommandeService} from '../../services/commande.service';
import {CartService} from '../../services/cart.service';
import {SearchPage} from '../search/search.page';
import {FilterPage} from '../filter/filter.page';
import {TranslateService} from '@ngx-translate/core';
import {translate} from '@angular/localize/src/tools/src/translate/source_files/source_file_utils';
import {AuthService} from '../../services/auth.service';
import {Utils} from '../../Utils';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.page.html',
    styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

    nom: string;
    description: string;
    articles: Article[];
    currency;
    public cartItemCount: BehaviorSubject<number> = new BehaviorSubject(0);
    // @ts-ignore
    filterObject: BehaviorSubject<any>;
    utilisateur = {} as Utilisateur;
    notifications = [];
    ip;
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
    resultRate = '1.0';
    grid: Boolean = true;
    oneColumn: Boolean = false;
    list: Boolean = false;
    action: string;
    public language: string;

    constructor(private http: HttpClient, private router: Router, private localStorage: Storage,
                private photoViewer: PhotoViewer, private navCtrl: NavController, private translateService: TranslateService,
                private msgService: MessageService, public network: Network, public dialog: Dialogs, private cmdService: CommandeService,
                public articleService: ArticleService, public cuService: CurrencyService, private modalController: ModalController,
                private userStorageUtils: UserStorageUtils, public platform: Platform, public cartService: CartService,
                public authService: AuthService) {

        this.filterObject = new BehaviorSubject({});
        this.cartService.getCartItemCount().subscribe((data) => {
            this.cartService.cartItemCount.next(data);
        });

        this.cuService.getRateObservable().subscribe(async (rate) => {
            this.resultRate = rate;
            await this.userStorageUtils.getCurrency().then(res => {
                if (res) {
                    this.currency = res.currency;
                } else {
                    this.currency = this.utilisateur.currency;
                }
            });
            for (let article of this.articleService.articles) {
                article.price = article.price * parseFloat(this.resultRate);
                console.log(article.price);
            }
        });
    }

    async ngOnInit() {
        await this.loadArticles();
        this.ip = environment.api_url;
    }

    // @ts-ignore
    async loadArticles() {
        await this.articleService.loadArticles()
            .subscribe(async (articles: Article[]) => {
                this.articleService.articles = articles;
                await this.userStorageUtils.getCurrency().then(async res => {
                    if (res) {
                        this.currency = res.currency;
                    } else {
                        this.currency = this.authService.currentUser.currency;
                    }
                });
                console.log('Articles', articles);
            });
    }

    insererArticle(): void {
        const url = `${environment.api_url}/article`;
        this.http.post(url, {nom: this.nom, description: this.description}).subscribe(res => console.log('res', res));
    }

    updateArticle(): void {
        const url = `${environment.api_url}/article`;
        this.http.put(url, {nom: this.nom, description: this.description}).subscribe(res => console.log('res', res));
    }

    // Go to cart page
    async gotoCartPage() {
        const modal = await this.modalController.create({
            component: CartPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    doRefresh($event) {
        this.loadArticles();
        $event.target.complete();
        //     .subscribe((articles: Article[]) => {
        //     this.articles = articles;
        //     console.log('Articles a partir du panier', articles);
        //     $event.target.complete();
        // });
    }

    showImage(imgId: string, title: string, event) {
        event.stopPropagation();
        this.photoViewer.show(`${environment.api_url}/image/${imgId}`, title, {share: true});
    }

    showDetails(id: string) {
        // this.navCtrl.navigateForward('tabs/product-detail/' + id);
        this.navCtrl.navigateRoot('menu/tabs/product-detail/' + id);
    }

    // async goToProductDetails(product) {
    //    this.navCtrl.navigateRoot('tabs/product-detail/' + id))
    // }

    async goToCreate() {
        await this.router.navigate(['menu/tabs/create-product']);
    }

    onSearch(event): void {
        const value: string = event.target.value;
        if (value) {
            this.articleService.articles = this.articles.filter((article) => {
                return article.title.toLowerCase().includes(value.toLowerCase());
            });
        }
    }

    onCancel(e) {
        this.loadArticles();
    }

    async openCart() {
        await this.navCtrl.navigateForward('/cart');
    }

    showOptions($event: MouseEvent, language: string) {

    }

    loadReceivedNotifications() {
        this.msgService.loadReceivedMessagesNotifications(this.authService.currentUser._id).subscribe(res => {
            this.notifications = res;
        });
    }

    goToTDS() {
        this.router.navigate(['/menu/tds-sneaker-page']);
    }

    // One column view function
    showOneColumn() {
        this.oneColumn = true;
        this.grid = false;
        this.list = false;
    }

    // Grid view function
    showGrid() {
        this.grid = true;
        this.oneColumn = false;
        this.list = false;
    }

    // List view function
    showList() {
        this.list = true;
        this.grid = false;
        this.oneColumn = false;
    }

    // Go to product details page
    async goToProductDetailsView(product) {
        const modal = await this.modalController.create({
            component: ProductViewPage,
            componentProps: product,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    public isWishList(item: Article) {
        return item.likes.includes(this.authService.currentUser._id);
    }

    // async checkLike(article: Article) {
    //     const utilisateurId: string = article.utilisateurId;
    //     if (utilisateurId === this.utilisateur._id) {
    //         this.presentToast('Impossible de liker son propre article', 1500);
    //     } else {
    //         this.like = !this.like;
    //         if (this.like === false) {
    //             const index = this.article.likes.indexOf(this.utilisateur._id, 0);
    //             this.article.likes.splice(index, 1);
    //         } else {
    //             this.article.likes.push(this.utilisateur._id);
    //         }
    //
    //         await this.articleService.checkLike(utilisateurId, this.id, article).subscribe(res => {
    //             console.log(res);
    //             const notification: Notification = {
    //                 title: 'Nouveaux Like',
    //                 message: this.utilisateur.username + ' a like votre article',
    //                 utilisateurId: utilisateurId,
    //                 article: this.article,
    //                 avatar: this.article.pictures[0],
    //                 read: false,
    //                 type: NotificationType.LIKE,
    //                 sender: this.utilisateur._id
    //             };
    //             setTimeout(async () => {
    //                 if (this.like === true) {
    //                     this.msgService.addNotification(notification).subscribe(res => {
    //                         this.socket.emit('notifying', {
    //                             user: this.utilisateur,
    //                             message: this.utilisateur.username + ' a like votre article'
    //                         });
    //                     });
    //                 }
    //             }, 10000);
    //         });
    //     }
    // }
    async gotoSearchPage() {
        const modal = await this.modalController.create({
            component: SearchPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    async openFilterPage() {
        const modal = await this.modalController.create({
            component: FilterPage,
            componentProps: {
                filterObject: this.filterObject
            }
        });
        modal.onDidDismiss()
            .then(async (data) => {
                console.log(data.data);
                console.log(this.filterObject);
                if (this.filterObject.value) {
                    if (this.filterObject.value.articles) {
                        this.articleService.articles = this.filterObject.value.articles;
                    }
                }
            });
        return await modal.present();
    }

}
