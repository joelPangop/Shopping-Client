import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Article} from '../../models/article-interface';
import {ModalController} from '@ionic/angular';
import {ArticleService} from '../../services/article.service';
import {ProductDetailPage} from '../product-detail/product-detail.page';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {ProductViewPage} from '../product-view/product-view.page';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-featured-products',
    templateUrl: './featured-products.page.html',
    styleUrls: ['./featured-products.page.scss'],
})
export class FeaturedProductsPage implements OnInit {
    products = [] as Article[];

    // Slider Options
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 2,
    };
    utilisateur = {} as Utilisateur;
    @ViewChild('like', {static: false, read: ElementRef}) fab: ElementRef;

    constructor(public productsService: ArticleService, public authService: AuthService,
                private modalController: ModalController, private userStorageUtils: UserStorageUtils) {
    }

    async ngOnInit() {
        this.getProductList();
        this.utilisateur = await this.userStorageUtils.getUser();
    }

    getProductList() {
        this.productsService.loadArticles().subscribe((res) => {
            this.productsService.articles = res;
            this.shuffle(this.productsService.articles);
        });
    }

    async goToProductDetails(product) {
        const modal = await this.modalController.create({
            component: ProductDetailPage,
            componentProps: product,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    public isWishList(item: Article) {
        return item.likes.includes(this.authService.currentUser._id);
    }

    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    // Go to product details page
    async goToProductDetailsView(product) {
        const modal = await this.modalController.create({
            component: ProductViewPage,
            componentProps: product,
            cssClass: 'cart-modal',
            backdropDismiss: false
        });
        modal.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                product = data.data.article;
            });
        return await modal.present();
    }
}
