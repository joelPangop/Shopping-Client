import { Component, OnInit } from '@angular/core';
import {CartPage} from '../cart/cart.page';
import {ProductDetailPage} from '../product-detail/product-detail.page';
import {ModalController} from '@ionic/angular';
import {Article} from '../../models/article-interface';
import {ArticleService} from '../../services/article.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {BehaviorSubject} from 'rxjs';
import {Commande} from '../../models/commande-interface';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {CommandeService} from '../../services/commande.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  // List of Products
  products = [] as Article[];
  utilisateur = {} as Utilisateur;
  public cartItemCount = new BehaviorSubject(0);

  // Check is product available or not
  isProductAvailable: boolean = false;

  constructor(public modalController: ModalController,
              private productsService: ArticleService,
              private userStorageUtils: UserStorageUtils, private cmdService: CommandeService) { }

  async ngOnInit() {
    this.getProductList();
    let data: Commande;

    this.cmdService.loadCheckoutCommande(this.utilisateur).subscribe((res) => {
      {
        data = res;
        this.cartItemCount = new BehaviorSubject(data ? data.itemsCart.length : 0);
      }
    });
    this.utilisateur = await this.userStorageUtils.getUser();
  }

  // Get All Products
  getProductList() {
   this.productsService.loadArticles().subscribe(async (articles: Article[]) => {
     this.products = articles;
   })
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
      // $ev.target.complete;

    // }
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

  // Go to cart page function
  async gotoCartPage() {
    this.dismiss();
    const modal = await this.modalController.create({
      cssClass: 'cart-modal',
      component: CartPage
    });
    return await modal.present();
  }

  // Back to previous page function
  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    })
  }

  public isWishList(item: Article){
    return item.likes.includes(this.utilisateur._id);
  }
}
