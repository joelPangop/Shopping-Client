import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from '@ionic/angular';
import {CategorieTelephone} from '../../models/CategorieTelephone';
import {Languages} from '../../models/Languages';
import {Currencies} from '../../models/Currencies';
import {forEach} from '@angular-devkit/schematics';
import {BehaviorSubject} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {ArticleService} from '../../services/article.service';
import {CurrencyService} from '../../services/currency.service';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-show-options',
    templateUrl: './show-options.page.html',
    styleUrls: ['./show-options.page.scss'],
})
export class ShowOptionsPage implements OnInit {

    public option;
    public language;
    public currency;
    public currencyIcon;
    languages: Map<string, string>;
    currencies: Map<string, string>;
    langOptionSubject: BehaviorSubject<any>;
    currOptionSubject: BehaviorSubject<any>;
    currIconOptionSubject: BehaviorSubject<any>;

    constructor(public navParams: NavParams, private languageService: LanguageService, private cuService: CurrencyService,
                private userStorageUtils: UserStorageUtils, private localStorage: Storage,
                private storage: NativeStorage) {
        this.option = this.navParams.get('option');
        this.language = this.navParams.get('language');
        this.currency = this.navParams.get('currency');
        this.currencyIcon = this.navParams.get('currencyIcon');
    }

    ngOnInit() {
        this.langOptionSubject = this.navParams.get('langOptionSubject');
        this.currOptionSubject = this.navParams.get('currOptionSubject');
        this.currIconOptionSubject = this.navParams.get('currIconOptionSubject');
        this.languages = new Map<string, string>();
        this.currencies = new Map<string, string>();
        this.cuService.fromCurrOptionSubject = this.currency;
        for (const item in Languages) {
            console.log('item:', item);
            console.log('item value:', Languages[item]);
            this.languages.set(item, Languages[item]);
        }
        for (const item in Currencies) {
            console.log('item:', item);
            console.log('item value:', Currencies[item]);
            this.currencies.set(item, Currencies[item]);
        }
    }

    setLanguage(l: string) {
        this.language = l;
        console.log(this.language);
        const popover = this.navParams.get('popover');
        popover.dismiss(this.language);
        this.langOptionSubject.next(this.language);
        this.languageService.setInitialAppLanguage(this.language);
    }

    async setCurrency(c: string) {
        if (this.option === 'userCurrency') {
            const popover = this.navParams.get('popover');
            popover.dismiss({
                currency: c,
                icon: Currencies[c]
            });
        } else {
            this.currency = c;
            this.cuService.setShowLoadingSpinningSubjectObservale(true);
            console.log(this.currency);
            this.currOptionSubject.next(this.currency);
            this.currIconOptionSubject.next(Currencies[this.currency]);
            this.cuService.toCurrOptionSubject = this.currency;
            await this.localStorage.set('currency', {
                currency: this.currency,
                icon: Currencies[this.currency]
            });
            await this.storage.setItem('currency', {
                currency: this.currency,
                icon: Currencies[this.currency]
            });
            this.cuService.getCurrencyRate().then((res) => {
                if (res) {
                    const popover = this.navParams.get('popover');
                    popover.dismiss(Currencies[this.currency]);
                }
            });
        }
    }
}
