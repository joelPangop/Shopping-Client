import {Component, OnInit} from '@angular/core';
import {Article} from '../../models/article-interface';
import {BehaviorSubject} from 'rxjs';
import {Utilisateur} from '../../models/utilisateur-interface';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {AlertController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
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
import {StorageService} from '../../services/storage.service';

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
    url = environment.api_url;
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
    blurClass;
    page = 0;
    totalPages;
    itemPerPage = 3;
    indexPage = 1;

    constructor(private http: HttpClient, private router: Router, private storage: StorageService, private toastCtrl: ToastController,
                private photoViewer: PhotoViewer, private navCtrl: NavController, private translateService: TranslateService,
                private msgService: MessageService, public network: Network, public dialog: Dialogs, private cmdService: CommandeService,
                public articleService: ArticleService, public cuService: CurrencyService, private modalController: ModalController,
                private userStorageUtils: UserStorageUtils, public platform: Platform, public cartService: CartService,
                public authService: AuthService, private alertController: AlertController) {
        this.cartItemCount = this.cartService.getCartItemCount();

        this.filterObject = new BehaviorSubject({});
    }

    async ngOnInit() {
        this.utilisateur = await this.authService.currentUser;
        await this.loadArticles();
        this.ip = environment.api_url;
    }

    async ionViewDidEnter() {
        if (this.authService.currentUser._id) {
            await this.cmdService.loadCheckoutCommande(this.authService.currentUser).subscribe((res) => {
                {
                    let data = res;
                    this.cartService.setCartItemCount(data ? data.itemsCart.length : 0);
                }
            });
        } else {
            this.storage.getObject('cart').then((res: any) => {
                let data = res;
                this.cartService.setCartItemCount(data ? data.itemsCart.length : 0);
            });
        }
    }

    // @ts-ignore
    async loadArticles() {
        await this.articleService.loadArticles()
            .subscribe(async (articles) => {
                this.articleService.articles = articles;
                this.totalPages = Math.ceil(articles.length / this.itemPerPage);
                this.updatePageInfo();
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
        this.itemPerPage = 2;
        this.oneColumn = true;
        this.grid = false;
        this.list = false;
        this.totalPages = Math.ceil(this.articleService.articles.length / this.itemPerPage);
        let i = 0;
        let y = 0;
        this.indexPage = 0;
        let arr: number[][] = [];
        while (i < this.articleService.articles.length - 1) {
            for (let a = i; a > i + this.itemPerPage; a++) {
                arr[this.indexPage].push(a);
            }
            if (this.page >= i && this.page < i + this.itemPerPage) {

                this.page = i;
            }
            this.indexPage++;
            i += this.itemPerPage;
        }

        console.log(arr);
        console.log(this.page);
        this.updatePageInfo();
    }

    // Grid view function
    showGrid() {
        this.itemPerPage = 3;
        this.grid = true;
        this.oneColumn = false;
        this.list = false;
        this.totalPages = Math.ceil(this.articleService.articles.length / this.itemPerPage);
        let i = 0;
        let w = 0;
        let item = 0;
        let total = this.articleService.articles.length;
        this.indexPage = 0;
        let arr: number[][] = [];

        for (let i = 1; i <= this.totalPages; i++) {
            arr.push([]);
        }
        console.log('arr', arr);
        let y = 0;
        while ( y < arr.length) {
            while (w < total) {
                let items = Math.abs(total - w) < this.itemPerPage ? total - w : this.itemPerPage;
                for (let i = 1; i <= items; i++) {
                    if(arr[y]){
                        arr[y].push(w + 1);
                        w++;
                    }
                }
                y++;
            }
        }

        for(let x = 0; x < arr.length; x++){
            if(arr[x].includes(this.page)){
                this.page = arr[x][arr[x].length - 1];
                this.indexPage = x + 2;
            }
            // this.indexPage++;
        }

        // while (i < this.articleService.articles.length - 1) {
        //     if (this.page >= i && this.page < i + this.itemPerPage) {
        //         this.page = i;
        //     }
        //     this.indexPage++;
        //     i += this.itemPerPage;
        // }

        console.log(this.page);
        this.updatePageInfo();
    }

    // List view function
    showList() {
        this.itemPerPage = 4;
        this.list = true;
        this.grid = false;
        this.oneColumn = false;
        this.totalPages = Math.ceil(this.articleService.articles.length / this.itemPerPage);
        let i = 0;
        this.indexPage = 0;
        while (i < this.articleService.articles.length - 1) {
            if (this.page >= i && this.page < i + this.itemPerPage) {
                this.page = i;
            }
            this.indexPage++;
            i += this.itemPerPage;
        }

        console.log(this.page);
        this.updatePageInfo();
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

    getRatedPrice(price: number, rate: number) {
        const retour = price * rate;
        return retour;
    }

    changeBorderColor($ev, pos: number) {
        console.log($ev.target.value);
        if (pos === 1) {
            //In JS file set the blur variable to the blur class
            this.blurClass = 'blurHover';
        } else if (pos === 2) {
// when done just set the blur to false
            this.blurClass = false;
        }
    }

    // Get Search Result
    getProducts($ev) {
        // this.getProductList();

        // set val to the value of the searchbar
        const val = $ev.target.value;

        // if the value is an empty string don't filter the product
        // if (val && val.trim() !== '') {
        this.articleService.loadArticles().subscribe((rep) => {
            this.articleService.articles = rep.filter((item) => {
                let resp = (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
                console.log('resp', resp);
                return resp;
            });
        });

        console.log('result', this.articleService.articles);
        // $ev.target.complete;

        // }
    }

    nextPage() {
        if (this.page < this.itemPerPage * (this.totalPages - 1)) {
            this.page += this.itemPerPage;
            this.indexPage++;
            this.updatePageInfo();
        }
    }

    prevPage() {
        if (this.page > 0) {
            this.page -= this.itemPerPage;
            this.indexPage--;
            this.updatePageInfo();
        }
    }

    goFirst() {
        if (this.page > 0) {
            this.page = 0;
            this.indexPage = 1;
            this.updatePageInfo();
        }
    }

    goLast() {
        if (this.page < this.articleService.articles.length - 1) {
            this.page = (this.totalPages - 1) * this.itemPerPage;
            this.indexPage = this.totalPages;
            this.updatePageInfo();
        }
    }

    updatePageInfo() {
        if (this.articleService.articles) {
            this.articles = this.articleService.articles.slice(this.page, this.articleService.articles.length > this.page + this.itemPerPage ?
                this.page + this.itemPerPage : this.articleService.articles.length);

        }
    }

    async addToCartHandler(article: Article) {
        const alert = await this.alertController.create({
            message: 'Add to cart ?',
            cssClass:'my-custom-class',
                // '<br/>' +
                // '<div no-margin><img src="../../../assets/images/cart_egoal1.png" alt="cart img"></div>',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('No');
                    }
                },
                {
                    text: 'Yes',
                    role: 'OK',
                    handler: () => {
                        console.log('Yes');
                        this.addToCart(article);
                    }
                }]
        });
        return alert.present().then(r => {
            console.log('res:', r);
        });
    }

    dismiss() {
        this.alertController.dismiss({
            'dismissed': true
        });
    }

    private addToCart(article: Article) {
        this.dismiss();
        if (this.utilisateur._id && this.utilisateur._id === article.utilisateurId) {
            this.presentToast('Vous ne pouvez pas ajouter votre propre article a la cart', 2000);
        } else {
            this.cartService.addArticle(article).then((res) => {
                console.log(res);
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

}
