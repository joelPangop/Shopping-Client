import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Article} from '../models/article-interface';
import {ArticleService} from './article.service';
import {itemCart} from '../models/itemCart-interface';
import {CommandeService} from './commande.service';
import {LoadingController} from '@ionic/angular';
import {StorageService} from './storage.service';
import {Commande} from '../models/commande-interface';
import {Utilisateur} from '../models/utilisateur-interface';
import {AuthService} from './auth.service';
import {OrderStatus} from '../models/OrderStatus';
import {itemStatus} from '../models/itemStatus';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartItemCount = new BehaviorSubject<number>(0);
    private cart: itemCart[] = [];
    data: Article[];
    total = 0;
    utilisateur: Utilisateur;
    public cartItems: itemCart[] = [];
    public taxAmount: number;
    dataI: itemCart[] = [];
    added = false;

    constructor(private articleService: ArticleService, private cmdService: CommandeService, private loadCtrl: LoadingController,
                private storage: StorageService, public authService: AuthService) {
        this.loadData();

    }

    async loadData() {
        this.utilisateur = this.authService.currentUser;
        this.articleService.loadArticles().subscribe((res) => {
            this.data = res;
        });
        if (this.utilisateur._id) {
            this.cmdService.loadCheckoutCommande(this.utilisateur).subscribe((res) => {
                if (res) {
                    if (res) {
                        this.cmdService.commande = res;
                        this.dataI = this.cmdService.commande.itemsCart;
                    }
                }
                console.log('data', this.dataI);
            });
        } else {
            await this.storage.getObject('cart').then((res: any) => {
                if (res) {
                    this.cmdService.commande = res as Commande;
                    this.dataI = this.cmdService.commande.itemsCart;
                }
            });
        }
    }

    getProducts() {
        return this.data;
    }

    async addArticle(article: Article) {
        console.log('data', this.dataI);
        // on vérifie si le panier est vide
        if (this.dataI && (this.dataI.length === 0)) {
            this.dataI = [];
            this.dataI.push({
                item: article,
                qty: 1,
                amount: article.price,
                status: itemStatus.ORDERED
            });
            this.cartItemCount.next(this.cartItemCount.value + 1);
            const timestamp = new Date().getUTCMilliseconds();
            let ran_number = this.getRandomInt() + timestamp + this.getRandomInt();
            this.cmdService.commande.num_commande = ran_number;
            this.cmdService.commande.itemsCart = this.dataI;
            this.cmdService.commande.completed = false;
            this.cmdService.commande.status = OrderStatus.CREATED;
            this.cmdService.commande.userId = this.utilisateur._id;
            this.cmdService.commande.amount = article.price;
            this.cmdService.commande.quantity = this.dataI.length;
            this.cmdService.createCommande().subscribe(async res => {
                console.log('resultat', res);
                this.cmdService.commande = res;
                await this.storage.setObject('cart', this.cmdService.commande);
            });
            // this.event.publish('cartItemCount', this.cartItemCount.value);
            this.setCartItemCount(this.cartItemCount.value);
        } else {
            // tslint:disable-next-line:prefer-const
            let names: string[] = [];
            this.dataI.forEach(d => {
                names.push(d.item.title);
            });
            if (!names.includes(article.title)) {
                this.dataI.push({
                    item: article,
                    qty: 1,
                    amount: article.price,
                    status: itemStatus.ORDERED
                });
                this.cartItemCount.next(this.cartItemCount.value + 1);
                // this.event.publish('cartItemCount', this.cartItemCount.value);
                this.setCartItemCount(this.cartItemCount.value);

            } else {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.dataI.length; i++) {
                    const element: itemCart = this.dataI[i];
                    if (article._id === element.item._id) {
                        // le panier contient déjà cette article
                        element.qty += 1;
                        element.amount += article.price;
                        this.added = true;
                    }
                }
            }
            this.cmdService.commande.itemsCart = this.dataI;
            this.cmdService.commande.userId = this.utilisateur._id;
            let amount = 0;
            for (let i of this.dataI) {
                amount += i.amount;
            }
            this.cmdService.commande.amount = amount;
            this.cmdService.commande.quantity = this.dataI.length;
            if (this.utilisateur._id) {
                this.cmdService.updateCommande().subscribe(async res => {
                    console.log('resultat', res);
                    this.cmdService.commande = res;
                    await this.storage.setObject('cart', this.cmdService.commande);
                });
            } else {
                await this.storage.setObject('cart', this.cmdService.commande);
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
        // await this.storage.set('commande', data);
    }

    decreaseArticle(article: Article) {

    }

    async removeProduct(item: itemCart, index, user: Utilisateur) {
        let msg = '';
        const loading = await this.loadCtrl.create({
            message: 'Please wait...'
        });
        await loading.present();
        for (let it of this.cartItems) {
            if (it.item._id === item.item._id) {
                // this.cartItemCount.next(this.cartItemCount.value - 1);
                this.cartItems.splice(index, 1);
                this.setCartItemCount(this.cartItems.length);
                this.total = this.total - (item.qty * item.amount);
                // this.event.publish('cartItemCount', this.cartItems.length);
                await this.storage.setObject('cart', this.cmdService.commande);
            }
        }
        if (this.cartItems.length === 0) {
            if (user._id) {
                this.cmdService.deleteCommande().subscribe(async (res) => {
                    console.log('result', res);
                    await loading.dismiss();
                    this.cartItemCount.next(0);
                    // this.event.publish('cartItemCount', this.cartItemCount.value);
                    this.setCartItemCount(this.cartItemCount.value);
                    msg = 'Votre panier a ete mis a jour';
                });
            } else {
                await this.storage.removeItem('cart');
                this.cartItemCount.next(0);
                // this.event.publish('cartItemCount', this.cartItemCount.value);
                this.setCartItemCount(this.cartItemCount.value);
            }
        } else {
            this.cmdService.commande.itemsCart = this.cartItems;
            let totalAmount = 0;
            for (let c of this.cartItems) {
                totalAmount += c.amount;
            }
            this.taxAmount = this.total * 0.1;
            this.cmdService.commande.amount = totalAmount;
            this.cmdService.commande.quantity = this.cartItems.length;
            if (user._id) {
                this.cmdService.updateCommande().subscribe(async (res) => {
                    this.cmdService.commande = res.article;
                    await this.storage.setObject('cart', this.cmdService.commande);
                    console.log('result', res.result);
                    if (res.result === 'successfull') {
                        await loading.dismiss();
                    }
                    this.cartItemCount.next(this.cartItems.length);
                    // this.event.publish('cartItemCount', this.cartItemCount.value);
                    this.setCartItemCount(this.cartItemCount.value);
                    msg = 'Votre panier a ete mis a jour';
                });
            } else {
                await this.storage.setObject('cart', this.cmdService.commande);
                await loading.dismiss();
                this.cartItemCount.next(this.cartItems.length);
                // this.event.publish('cartItemCount', this.cartItemCount.value);
                this.setCartItemCount(this.cartItemCount.value);
                msg = 'Votre panier a ete mis a jour';
            }
        }
        return msg;
    }

    setCartItemCount(value: number) {
        this.cartItemCount.next(value);
    }

    getCartItemCount(): BehaviorSubject<number> {
        return this.cartItemCount;
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(300000000));
    }
}
