import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Article} from '../../models/article-interface';
import {BehaviorSubject} from 'rxjs';
import {AlertController, ModalController, NavController, Platform, PopoverController} from '@ionic/angular';
import {MessageService} from '../../services/message.service';
import {Currency, Utilisateur} from '../../models/utilisateur-interface';
import {ArticleService} from '../../services/article.service';
import {CartPage} from '../cart/cart.page';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {CurrencyService} from '../../services/currency.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {CategoriesService} from '../../services/categories.service';
import {Storage} from '@ionic/storage';
import {Commande} from '../../models/commande-interface';
import {CommandeService} from '../../services/commande.service';
import {CartService} from '../../services/cart.service';
import {SearchPage} from '../search/search.page';
import {SearchCategoriesPage} from '../search-categories/search-categories.page';
import {PreviewSearchPage} from '../preview-search/preview-search.page';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../services/language.service';
import {StorageService} from '../../services/storage.service';
import {AuthService} from '../../services/auth.service';
import {Currencies} from '../../models/Currencies';
import {IonicSelectableComponent} from 'ionic-selectable';

declare function test1(t): any;

declare function getUserIP(t): any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

    nom: string;
    description: string;
    articles: Article[];
    public cartItemCount = new BehaviorSubject(0);
    utilisateur = {} as Utilisateur;
    notifications = [];
    ip;
    isSearch: boolean;
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
    showLoadingSpining = false;
    notif_number: number;
    categories = [];
    searchCategories: string[] = [];
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 2,
    };
    category: string;
    choosenCategories: string[] = [];
    params: {
        name: 'Simon'
    };

    constructor(private modalController: ModalController, public platform: Platform, private popoverController: PopoverController, private articleService: ArticleService,
                private navCtrl: NavController, private cuService: CurrencyService, public languageService: LanguageService,
                private msgservice: MessageService, private cmdService: CommandeService, private translate: TranslateService,
                private alertController: AlertController, private userStorageUtils: UserStorageUtils, private storageService: StorageService,
                private router: Router, private categoryService: CategoriesService, public cartService: CartService, public authService: AuthService) {

    }

    webSocket: WebSocket;

    async ngOnInit() {
        console.log('test1');
        this.getCategories();
        this.webSocket = this.userStorageUtils.getWebSocket();
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

        let data: Commande;
        this.cmdService.loadCommande(this.authService.currentUser).subscribe((res) => {
            {
                data = res;
                this.cartService.cartItemCount = new BehaviorSubject(data ? data.itemsCart.length : 0);
            }
        });

        this.isSearch = false;
        // this.loadAll();
        console.log(this.platform.platforms());
        this.articleService.loadArticles().subscribe(res => {
            this.articleService.articles = res as Article[];
        });
    }

    async test() {
        const OPEN = WebSocket.OPEN;
        const self = this;
// const webSocket: WebSocket = new WebSocket('https://egoalservice.azurewebsites.net');
        this.webSocket.send('test');
        this.webSocket.onmessage = function(event) {
            console.log(event.data);
            new Event(event.data);

            self.presentAlert(event.data);
        };
    }

    async presentAlert(msg: any): Promise<void> {
        const alert = await this.alertController.create({
            message: msg,
            buttons: ['OK']
        });
        await alert.present();
    }

    // Go to cart page
    async gotoCartPage() {
        const modal = await this.modalController.create({
            component: CartPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    public async showOptions(ev, option) {
        // @ts-ignore
        const popover = await this.popoverController.create({
            component: ShowOptionsPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                currOptionSubject: this.currOptionSubject,
                option
            }
        });
        return await popover.present();
    }

    getCategories() {
        this.categories = this.categoryService.categoriesList();
        this.shuffle(this.categories);
    }

    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    shuffleImage(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    goToCategory(cat) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                special: JSON.stringify(cat)
            }
        };
        this.router.navigate(['menu/tabs/category-preview'], navigationExtras);
    }

    async gotoSearchPage() {
        const modal = await this.modalController.create({
            component: SearchPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }

    element: string = '';

    search() {
        this.elementSearchSubject.next(this.element);
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

    async chooseCategory(ev) {
        const popover = await this.popoverController.create({
            component: SearchCategoriesPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                catOptionSubject: this.choosenCategories
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                console.log(this.catOptionSubject.value);
                // if(this.catOptionSubject.value && this.catOptionSubject.value !== 'All Categories'){
                //     this.category = '';
                //     for(let c of this.catOptionSubject.value as string[]){
                //         this.category +=c+ ' '
                //     }
                // }
            });
        return await popover.present();
    }

}
