import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, Platform} from '@ionic/angular';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article-interface';
import {ProductViewPage} from '../product-view/product-view.page';
import {CartService} from '../../services/cart.service';
import {CartPage} from '../cart/cart.page';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {CommandeService} from '../../services/commande.service';
import {BehaviorSubject} from 'rxjs';
import {Commande} from '../../models/commande-interface';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {

  products: Article[];
  utilisateur = {} as Utilisateur;
  public cartItemCount: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private productsService: ArticleService, private userStorageUtils: UserStorageUtils, public authService: AuthService,
              public modalController: ModalController, private cmdService: CommandeService,
              private navCtrl: NavController, public cartService: CartService, private storage: StorageService) {
    this.getProductList();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  public async ionViewDidEnter() {
    this.utilisateur = await this.authService.currentUser;

    this.getProductList();
    if (this.authService.currentUser._id) {
      this.cmdService.loadCheckoutCommande(this.authService.currentUser).subscribe((res) => {
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

  async ngOnInit() {
    this.utilisateur = this.authService.currentUser;

    this.getProductList();
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

  // Get Products
  getProductList() {
    this.productsService.loadArticles().subscribe((res) => {
      this.products = res.filter(r => r.likes.includes(this.utilisateur._id));
      console.log(this.products);
    });
  }

  // Go to product details page
  async goToProductDetails(product: Article) {
    const modal = await this.modalController.create({
      component: ProductViewPage,
      componentProps: product,
      cssClass: 'cart-modal'
    });
    return await modal.present();
  }

  showDetails(id: string) {
    this.navCtrl.navigateRoot('tabs/product-detail/' + id);
  }

  // Go to cart page
  async gotoCartPage() {
    const modal = await this.modalController.create({
      component: CartPage,
      cssClass: 'cart-modal'
    });
    return await modal.present();
  }
}
