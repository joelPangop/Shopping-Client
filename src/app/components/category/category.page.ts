import {Component, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {Article} from '../../models/article-interface';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../models/environements';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {CurrencyService} from '../../services/currency.service';
import {ArticleService} from '../../services/article.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {ProductViewPage} from '../product-view/product-view.page';

@Component({
    selector: 'app-category',
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

    catTitle: string;
    articles = [] as Article[];
    utilisateur = {} as Utilisateur;
    public currency: string;
    grid: Boolean = true;
    oneColumn: Boolean = false;
    list: Boolean = false;
    cat: string[];
    sousTitre: string;

    constructor(private activatedRoute: ActivatedRoute, private toastCtrl: ToastController, private http: HttpClient,
                private photoViewer: PhotoViewer, private navCtrl: NavController, private articleService: ArticleService,
                private userStorageUtils: UserStorageUtils, public cuService: CurrencyService, private modalController: ModalController) {
        this.cat = [];
        this.catTitle = "";
    }

    async ngOnInit() {
        this.catTitle = this.activatedRoute.snapshot.paramMap.get('catTitle');
        console.log(this.catTitle);
        let carParse = JSON.parse(this.catTitle);
        if(this.catTitle){
            this.cat = carParse.cats;
            this.sousTitre = this.cat.length === 3 ? this.cat[2] : this.cat[1];
        }
        this.utilisateur = await this.userStorageUtils.getUser();
        await this.userStorageUtils.getCurrency().then(async res => {
            this.currency = res ? res.currency : this.utilisateur.currency.currency;
            await this.loadArticles();
        });

    }

    loadArticles() {
        this.articleService.loadArticlesByCategory(this.catTitle).subscribe(async data => {
            this.articles = data;
            const exchangeRate = await this.cuService.getExchangeRate(this.utilisateur.currency.currency, this.currency);
            let rate = exchangeRate[this.utilisateur.currency.currency + '_' + this.currency].val;
            for (let article of this.articles) {
                article.price = article.price * parseFloat(rate);
                console.log(article.price);
            }
        });
    }

    doRefresh($event) {
        this.loadArticles();
        console.log('Articles a partir du panier', this.articles);
        $event.target.complete();
    }

    showImage(imgId: string, title: string, event) {
        event.stopPropagation();
        this.photoViewer.show(`${environment.api_url}/image/${imgId}`, title, {share: true});
    }

    showDetails(id: string) {
        this.navCtrl.navigateRoot('tabs/product-detail/' + id);
    }

    async presentToast(msg: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration
        });
        toast.present();
    }

    gotoCartPage() {

    }

    showOneColumn() {
        this.oneColumn = true;
        this.grid = false
        this.list = false;
    }

    showGrid() {
        this.grid = true;
        this.oneColumn = false;
        this.list = false;
    }

    showList() {
        this.list = true;
        this.grid = false;
        this.oneColumn = false;
    }

    async goToProductDetails(item: Article) {
        const modal = await this.modalController.create({
            component: ProductViewPage,
            componentProps: item,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    public isWishList(item: Article) {
        return item.likes.includes(this.utilisateur._id);
    }
}
