import {Component, OnInit} from '@angular/core';
import {CommandeService} from '../../services/commande.service';
import {ArticleService} from '../../services/article.service';
import {CurrencyService} from '../../services/currency.service';
import {ModalController, Platform} from '@ionic/angular';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {Article} from '../../models/article-interface';
import {ActivatedRoute} from '@angular/router';
import {CartPage} from '../cart/cart.page';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-deal-list',
    templateUrl: './deal-list.page.html',
    styleUrls: ['./deal-list.page.scss'],
})
export class DealListPage implements OnInit {

    articles: Article[];
    option;
    grid: Boolean = true;
    oneColumn: Boolean = false;
    list: Boolean = false;
    title: any;
    public cartItemCount: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(private cmdService: CommandeService, private activatedRoute: ActivatedRoute, public authService: AuthService,
                public articleService: ArticleService, public cuService: CurrencyService, private modalController: ModalController,
                private userStorageUtils: UserStorageUtils, public platform: Platform, public cartService: CartService,) {
        this.cartItemCount = this.cartService.getCartItemCount();
    }

    ngOnInit() {
        this.option = this.activatedRoute.snapshot.paramMap.get('option');
        this.loadArticles();
    }

    loadArticles() {
        this.articleService.loadArticles().subscribe((res) => {
            switch (this.option) {
                case 'discounted':
                    this.articles = res.filter((r) => {
                        return r.price_discounted === true;
                    });
                    break;
                default:
                    this.articles = [];
            }
        });
    }

    showOneColumn() {
        this.oneColumn = true;
        this.grid = false;
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

    showImage(string: string, title: string, $event: MouseEvent) {

    }

    isWishList(item: Article) {
        return item.likes.includes(this.authService.currentUser._id);
    }

    showDetails(_id: string) {

    }

    getRatedPrice(price: number, rate: number) {
        return price * rate;
    }

    doRefresh($event: CustomEvent) {

    }

    async gotoCartPage() {
        const modal = await this.modalController.create({
            component: CartPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

}
