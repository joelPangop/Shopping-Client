import {Component, OnInit} from '@angular/core';
import {ProductDetailPage} from '../product-detail/product-detail.page';
import {Article} from '../../models/article-interface';
import {Utilisateur} from '../../models/utilisateur-interface';
import {BehaviorSubject} from 'rxjs';
import {ModalController, NavParams} from '@ionic/angular';
import {ArticleService} from '../../services/article.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {CommandeService} from '../../services/commande.service';

@Component({
    selector: 'app-preview-search',
    templateUrl: './preview-search.page.html',
    styleUrls: ['./preview-search.page.scss'],
})
export class PreviewSearchPage implements OnInit {
    // List of Products
    products = [] as Article[];
    utilisateur = {} as Utilisateur;
    public cartItemCount = new BehaviorSubject(0);
    categories: string[];

    // Check is product available or not
    isProductAvailable: boolean = false;
    elementSearchSubject: BehaviorSubject<any>;
    catOptionSubject: BehaviorSubject<any>;

    constructor(public modalController: ModalController,
                private productsService: ArticleService, private navParams: NavParams,
                private userStorageUtils: UserStorageUtils, private cmdService: CommandeService) {
    }

    ngOnInit() {
        this.getProductList();
        this.elementSearchSubject = this.navParams.get('elementSearchSubject');
        this.categories = this.navParams.get('catOptionSubject');
        // this.categories = this.catOptionSubject.value;
    }

    // Get All Products
    getProductList() {
        this.productsService.loadArticles().subscribe(async (articles: Article[]) => {
            this.products = this.filterProducts(articles);
            console.log('products', this.products);
        });
    }

    filterProducts(array: Article[]): Article[] {
        let productsFiltred;
        let products: Article[] = [];
        if (this.categories !== null && this.categories.length > 0) {
            for (let c of this.categories) {
                for (let pr of array) {
                    if (pr.categories.includes(c)) {
                        products.push(pr);
                    }
                }
            }
            productsFiltred = [...new Set(products)];
        } else {
            productsFiltred = array;
        }
        return productsFiltred;
    }

    // Get Search Result
    getProducts($ev) {
        // this.getProductList();

        // set val to the value of the searchbar
        const val = $ev.target.value;

        // if the value is an empty string don't filter the product
        // if (val && val.trim() !== '') {
        this.isProductAvailable = true;
        this.products = this.productsService.articles.filter((item) => {
            let resp = (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            console.log('resp', resp);
            return resp;
        });
        console.log('result', this.products);
    }

    // Go to product details page function
    async goToProductDetails(product) {
        const modal = await this.modalController.create({
            component: ProductDetailPage,
            cssClass: 'cart-modal',
            componentProps: product
        });
        return await modal.present();
    }

    public isWishList(item: Article) {
        return item.likes.includes(this.utilisateur._id);
    }
}
