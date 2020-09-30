import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Article} from '../models/article-interface';
import {ArticleService} from './article.service';
import {itemCart} from '../models/itemCart-interface';
import {CommandeService} from './commande.service';
import {LoadingController} from '@ionic/angular';
import {StorageService} from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartItemCount = new BehaviorSubject<number>(0);
    private cart: itemCart[] = [];
    data: Article[];
    total = 0;

    constructor(private articleService: ArticleService, private cmdService: CommandeService, private loadCtrl: LoadingController,
                private storage: StorageService) {
        this.loadData();
    }

    loadData() {
        this.articleService.loadArticles().subscribe((res) => {
            this.data = res;
        });
    }

    getProducts() {
        return this.data;
    }

    async addArticle(product: itemCart) {
      if (product.qty) {
        product.qty = product.qty + 1;
      } else {
        product.qty = 1;
        product.qty = product.qty + 1;
      }
      // this.total = this.total + product.discountPrice;
      this.total = this.total + product.item.price;
      product.amount = product.amount + product.item.price;
      // await this.storage.set('cart', this.cartItems);
      this.cartItemCount.next(this.cartItemCount.value + 1);

      this.cmdService.commande.itemsCart = this.cart;
      let totalAmount = 0;
      for (let c of this.cart) {
        totalAmount += c.amount;
      }
      this.cmdService.commande.amount = totalAmount;
      const loading = await this.loadCtrl.create({
        message: 'Please wait...'
      });
      await loading.present();

      this.cmdService.updateCommande().subscribe(async (res) => {
        this.cmdService.commande = res.article;
        await this.storage.setObject('cart', this.cmdService.commande);
        console.log('result', res.result);
        if (res.result === 'successfull') {
          await loading.dismiss();
        }
      });
    }

    decreaseArticle(article: Article) {

    }

    removeArticle(article: Article) {

    }

    setCartItemCount(value: number) {
        this.cartItemCount.next(value);
    }

    getCartItemCount(): BehaviorSubject<number> {
        return this.cartItemCount;
    }

}
