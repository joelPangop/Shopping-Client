import {Component, OnInit} from '@angular/core';
import {Events, NavController, Platform, PopoverController} from '@ionic/angular';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article-interface';
import {BehaviorSubject} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {CurrencyService} from '../../services/currency.service';

@Component({
    selector: 'app-top-header',
    templateUrl: './top-header.page.html',
    styleUrls: ['./top-header.page.scss']
})
export class TopHeaderPage implements OnInit {

    isSearch: boolean;
    private articles: any;
    // @ts-ignore
    langOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    language;
    currency;
    currencyIcon;
    showLoadingSpining = false;

    constructor(private platform: Platform, private popoverController: PopoverController, private articleService: ArticleService,
                private navCtrl: NavController, private languageService: LanguageService, private cuService: CurrencyService,
                private event: Events) {
        this.isSearch = false;
        this.event.subscribe('showLoadingSpining', (res) => {
            this.showLoadingSpining = res;
        });
    }

    ngOnInit() {
        this.showLoadingSpining = false;
        this.language = 'FR';
        this.currency = 'CAD';
        this.currencyIcon = 'flag-for-flag-canada';
        this.isSearch = false;
        console.log(this.platform.platforms());
        this.articleService.loadArticles().subscribe(res => {
            this.articleService.articles = res as Article[];
        });
        this.languageService.setInitialAppLanguage(this.language);
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

    onCancel($event: CustomEvent) {
        this.isSearch = false;
    }

    openSearch() {
        this.isSearch = true;
    }

    onSearch(event): void {
        const value: string = event.target.value;
        if (value) {
            this.articleService.articles = this.articleService.articles.filter((article) => {
                return article.title.toLowerCase().includes(value.toLowerCase());
            });
        }
    }

    openProfil() {
        this.navCtrl.navigateRoot('/menu/profile');
    }

    openCart() {
        this.navCtrl.navigateForward('/cart');
    }

}
