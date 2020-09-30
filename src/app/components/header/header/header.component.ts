import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Utilisateur} from '../../../models/utilisateur-interface';
import {AlertController, ModalController, NavController, Platform, PopoverController} from '@ionic/angular';
import {ArticleService} from '../../../services/article.service';
import {CurrencyService} from '../../../services/currency.service';
import {MessageService} from '../../../services/message.service';
import {Router} from '@angular/router';
import {LanguageService} from '../../../services/language.service';
import {UserStorageUtils} from '../../../services/UserStorageUtils';
import {StorageService} from '../../../services/storage.service';
import {CategoriesService} from '../../../services/categories.service';
import {CartService} from '../../../services/cart.service';
import {AuthService} from '../../../services/auth.service';
import {ShowOptionsPage} from '../../show-options/show-options.page';
import {ViewProfilePage} from '../../view-profile/view-profile.page';
import {PreviewSearchPage} from '../../preview-search/preview-search.page';
import {CartPage} from '../../cart/cart.page';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {CommandeService} from '../../../services/commande.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    isSearch: boolean;
    private articles: any;
    // @ts-ignore
    // @ts-ignore
    langOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    catOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    elementSearchSubject: BehaviorSubject<string> = new BehaviorSubject();
    language;
    currency;
    currencyIcon;
    showLoadingSpining = false;
    utilisateur: Utilisateur;
    notif_number: number;
    choosenCategories: string[] = [];
    category: string;
    cartItemsCount: BehaviorSubject<number>;
    username: BehaviorSubject<string> = new BehaviorSubject<string>('');
    searchCategories: string[] = [];
    categories = [];

    constructor(public platform: Platform, private popoverController: PopoverController, private articleService: ArticleService,
                private navCtrl: NavController, private cuService: CurrencyService, private modalController: ModalController,
                private msgservice: MessageService, private router: Router, public languageService: LanguageService, private cmdService: CommandeService,
                private alertController: AlertController, private userStorageUtils: UserStorageUtils, private storageService: StorageService,
                private categoryService: CategoriesService, public cartService: CartService, public authService: AuthService,
                private storage: StorageService) {
        this.isSearch = false;
        this.cartItemsCount = this.cartService.getCartItemCount();
    }

    async ngOnInit() {

        this.getCategories();
        // this.webSocket = this.websocketService.getWebSocket();
        this.language = this.languageService.selected;
        this.searchCategories = [
            'Automobile',
            'Auto',
            'Voiture',
            'Moto',
            'Camion',
            'Mode',
            'Vetement',
            'Homme',
            'Enfant',
            'Chaussure',
            'Accessoire',
            'Sport_Loisir',
            'Piece_Accessoire',
            'Depannage',
            'Electronique',
            'Ordinateur',
            'Laptop',
            'Desktop',
            'Telephone & Tablet',
            'Telephone',
            'Tablet',
            'TV & Accessoires',
            'House',
            'Home',
            'Chambre',
            'Salon',
            'Salle de bain',
            'Cuisine',
            'Parking-Garden',
            'Electromenager',
            'Office-industrie',
            'Bureau',
            'Professionel',
            'Ecole',
            'Industrie',
            'Gadget',
            'Jeu',
            'Jeu_Video',
            'Societe',
            'Jouet',
            'Divers'
        ];
        if (this.authService.currentUser) {
            await this.cmdService.loadCommande(this.authService.currentUser).subscribe((res) => {
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
        // this.socket.connect();
        this.showLoadingSpining = false;
        // this.cartService.getCartItemCount().subscribe((data) => {
        //     this.cartService.cartItemCount.next(data);
        // });

        this.isSearch = false;
    }


    async presentAlert(data) {
        const alert = await this.alertController.create({
            header: 'test',
            message: data,
            buttons: ['OK']
        });
        await alert.present();
    }

    public async showOptions(ev, option) {
        // @ts-ignore
        const popover = await this.popoverController.create({
            component: ShowOptionsPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                langOptionSubject: this.langOptionSubject,
                currOptionSubject: this.currOptionSubject,
                currIconOptionSubject: this.currIconOptionSubject,
                language: this.language,
                currency: this.currency,
                currencyIcon: this.currencyIcon,
                option
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                console.log(this.langOptionSubject.value);
                if (this.langOptionSubject.value) {
                    this.language = this.langOptionSubject.value;
                }
                if (this.currOptionSubject.value) {
                    this.currency = this.currOptionSubject.value;
                    this.currencyIcon = this.currIconOptionSubject.value;
                }
            });
        return await popover.present();
    }

    public async showProfile(ev) {
        // @ts-ignore
        const popover = await this.popoverController.create({
            component: ViewProfilePage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
        });
        return await popover.present();
    }

    async openSearch(ev) {
        if (!this.catOptionSubject.value) {
            this.catOptionSubject.next([this.category]);
        }
        const popover = await this.popoverController.create({
            component: PreviewSearchPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-search-dialog',
            componentProps: {
                catOptionSubject: this.choosenCategories,
                elementSearchSubject: this.elementSearchSubject
            }
        });
        return await popover.present();
    }

    element: string = '';

    search() {
        this.elementSearchSubject.next(this.element);
    }

    // Go to cart page
    async gotoCartPage() {
        const modal = await this.modalController.create({
            component: CartPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    getCategories() {
        this.categories = this.categoryService.categoriesList();
        this.shuffle(this.categories);
    }

    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

}
