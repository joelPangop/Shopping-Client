import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, Platform, PopoverController} from '@ionic/angular';
import {ShowOptionsPage} from '../../show-options/show-options.page';
import {ArticleService} from '../../../services/article.service';
import {Article} from '../../../models/article-interface';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {CurrencyService} from '../../../services/currency.service';
import {ShowNotificationPage} from '../../show-notification/show-notification.page';
import {MessageService} from '../../../services/message.service';
import {Utilisateur} from '../../../models/utilisateur-interface';
import {UserStorageUtils} from '../../../services/UserStorageUtils';
import {ViewProfilePage} from '../../view-profile/view-profile.page';
import {Router} from '@angular/router';
import {PreviewSearchPage} from '../../preview-search/preview-search.page';
import {StorageService} from '../../../services/storage.service';
import {CategoriesService} from '../../../services/categories.service';
import {CartService} from '../../../services/cart.service';
import {AuthService} from '../../../services/auth.service';
import {LanguageService} from '../../../services/language.service';
import {CartPage} from '../../cart/cart.page';

@Component({
    selector: 'app-top-header',
    templateUrl: './top-header.page.html',
    styleUrls: ['./top-header.page.scss']
})
export class TopHeaderPage implements OnInit {

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
                private msgservice: MessageService, private router: Router, public languageService: LanguageService,
                private alertController: AlertController, private userStorageUtils: UserStorageUtils, private storageService: StorageService,
                private categoryService: CategoriesService, public cartService: CartService, public authService: AuthService) {
        this.isSearch = false;
        this.cartItemsCount = this.cartService.getCartItemCount();

    }

    ionViewWillEnter() {

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
