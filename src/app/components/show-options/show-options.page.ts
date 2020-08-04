import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, PopoverController} from '@ionic/angular';
import {CategorieTelephone} from '../../models/CategorieTelephone';
import {Languages} from '../../models/Languages';
import {Currencies} from '../../models/Currencies';
import {forEach} from '@angular-devkit/schematics';
import {BehaviorSubject} from 'rxjs';
import {ArticleService} from '../../services/article.service';
import {CurrencyService} from '../../services/currency.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../services/language.service';
import {StorageService} from '../../services/storage.service';
import {AuthService} from '../../services/auth.service';

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
    languages: any[];
    currencies: Map<string, string>;
    langOptionSubject: BehaviorSubject<any>;
    currOptionSubject: BehaviorSubject<any>;
    currIconOptionSubject: BehaviorSubject<any>;

    constructor(public navParams: NavParams, private cuService: CurrencyService, private popoverController: PopoverController,
                private userStorageUtils: UserStorageUtils, private localStorage: Storage, private storageService: StorageService,
                private translateService: TranslateService, private languageService: LanguageService, public authService: AuthService) {
        this.option = this.navParams.get('option');
        this.language = this.navParams.get('language');
        this.currency = this.navParams.get('currency');
        this.currencyIcon = this.navParams.get('currencyIcon');
        this.currencies = new Map<string, string>();
    }

    ngOnInit() {
        this.languages = this.languageService.getLanguages();
        this.language = this.languageService.selected;
        for (const item in Currencies) {
            console.log('item:', item);
            console.log('item value:', Currencies[item]);
            this.currencies.set(item, Currencies[item]);
        }
    }

    setLanguage(l: string) {
        console.log(this.language);
        this.languageService.setLanguage(l);
        this.popoverController.dismiss();
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
            this.storageService.setObject('currency', {
                currency: this.currency,
                icon: Currencies[this.currency]
            });
            this.authService.currency = this.currency
            this.authService.currencyIcon = Currencies[this.currency];
            // this.localStorage.set('currency', {
            //     currency: this.currency,
            //     icon: Currencies[this.currency]
            // });

            this.cuService.getCurrencyRate().then((res) => {
                if (res) {
                    const popover = this.navParams.get('popover');
                    popover.dismiss(Currencies[this.currency]);
                }
            });
        }
    }
}
