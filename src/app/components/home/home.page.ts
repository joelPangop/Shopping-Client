import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Article} from '../../models/article-interface';
import {BehaviorSubject} from 'rxjs';
import {AlertController, MenuController, ModalController, NavController, Platform, PopoverController} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {MessageService} from '../../services/message.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {ArticleService} from '../../services/article.service';
import {CartPage} from '../cart/cart.page';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {LanguageService} from '../../services/language.service';
import {CurrencyService} from '../../services/currency.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {TranslateService} from '@ngx-translate/core';
import {CategoriesService} from '../../services/categories.service';
import {Storage} from '@ionic/storage';
import {Commande} from '../../models/commande-interface';
import {CommandeService} from '../../services/commande.service';
import {CartService} from '../../services/cart.service';
import {SearchPage} from '../search/search.page';
import {SearchCategoriesPage} from '../search-categories/search-categories.page';
import {PreviewSearchPage} from '../preview-search/preview-search.page';

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
    currency;
    currencyIcon;
    showLoadingSpining = false;
    notif_number: number;
    categories = [];

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 2,
    };

    category: string;

    constructor(private modalController: ModalController, public platform: Platform, private popoverController: PopoverController, private articleService: ArticleService,
                private navCtrl: NavController, private languageService: LanguageService, private cuService: CurrencyService,
                private msgservice: MessageService, private storage: NativeStorage, private cmdService: CommandeService,
                private alertController: AlertController, private userStorageUtils: UserStorageUtils, private translate: TranslateService,
                private router: Router, private categoryService: CategoriesService, public cartService: CartService, private localStorage: Storage) {

        this.category = 'All Categories';
        this.cuService.getShowLoadingSpinningSubjectObservale().subscribe((data) => {
            this.showLoadingSpining = data;
        });

        this.cartService.getCartItemCount().subscribe((data) => {
            this.cartItemCount.next(data);
        });

        let data: Commande;

        this.cmdService.loadCommande(this.utilisateur).subscribe((res) => {
            {
                data = res;
                this.cartItemCount = new BehaviorSubject(data ? data.itemsCart.length : 0);
            }
        });
        // this.event.subscribe('nbNotif', (res) => {
        //     this.notif_number -= res;
        //     console.log('notifs number', this.notif_number);
        // });
        // this.event.subscribe('addNotif', (res) => {
        //     this.notif_number = this.notif_number + res;
        //     // this.presentAlert(this.notif_number);
        //     console.log('notifs number', this.notif_number);
        // });
        // this.menuCtrl.toggle();
    }

    async ngOnInit() {
        console.log('test1');
        this.getCategories();

        // this.socket.connect();
        this.showLoadingSpining = false;
        this.cartService.getCartItemCount().subscribe((data) => {
            this.cartItemCount.next(data);
        });
        this.utilisateur = await this.userStorageUtils.getUser();

        console.log('def language', this.translate.getBrowserLang());
        if (!this.userStorageUtils.getLanguage()) {
            this.language = this.translate.getBrowserLang();
        } else {
            this.language = await this.userStorageUtils.getLanguage();
        }

        let data: Commande;

        this.cmdService.loadCommande(this.utilisateur).subscribe((res) => {
            {
                data = res;
                this.cartItemCount = new BehaviorSubject(data ? data.itemsCart.length : 0);
            }
        });

        await this.userStorageUtils.getCurrency().then(res => {
            if (!res) {
                this.currency = 'CAD';
                this.currencyIcon = 'flag-for-flag-canada';
            } else {
                this.currency = res.currency;
                this.currencyIcon = res.icon;
            }
        });

        this.isSearch = false;
        // this.loadAll();
        console.log(this.platform.platforms());
        this.articleService.loadArticles().subscribe(res => {
            this.articleService.articles = res as Article[];
        });
        this.languageService.setInitialAppLanguage(this.language);
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
        this.router.navigate(['tabs/category-preview'], navigationExtras);
    }

    async gotoSearchPage() {
        const modal = await this.modalController.create({
            component: SearchPage,
            cssClass: 'cart-modal'
        });
        return await modal.present();
    }
    element: string = '';
    search(){
        this.elementSearchSubject.next(this.element);
    }

    async openSearch(ev){
        const popover = await this.popoverController.create({
            component: PreviewSearchPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-search-dialog',
            componentProps: {
                categories: this.catOptionSubject.value,
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
                catOptionSubject: this.catOptionSubject
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                console.log(this.catOptionSubject.value);
                if(this.catOptionSubject.value){
                    this.category = '';
                    for(let c of this.catOptionSubject.value as string[]){
                        this.category +=c+ ' '
                    }
                }
            });
        return await popover.present();
    }
}
