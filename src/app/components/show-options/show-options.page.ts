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
    currencies: any[];
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
        this.currencies = [];
        for (const item in Currencies) {
            console.log('item:', item);
            console.log('item value:', Currencies[item]);
            this.currencies.push({currency: item, icon: Currencies[item]});
        }
    }

    ngOnInit() {
        this.languages = this.languageService.getLanguages();
        this.language = this.languageService.selected;
        this.currency = this.authService.currency;
        // this.currency = this.authService.currency.value;
    }

    setLanguage(l: string) {
        console.log(this.language);
        this.languageService.setLanguage(l);
        this.popoverController.dismiss();
    }

    setCurrency(c: any) {
        console.log(this.currency);
        if (this.option === 'userCurrency') {
            const popover = this.navParams.get('popover');
            popover.dismiss({
                currency: c.currency,
                icon: Currencies[c.currency]
            });
        } else {
            this.authService.currency = c.currency;
            this.authService.setCurrency(c).then(r => {
                console.log('hello');
            });
            // this.authService.currencyIcon = c.icon;
            // this.authService.currencyTest = c.currency;

            console.log(this.currency);
            console.log(this.authService.currency);
            // this.currOptionSubject.next(this.currency);

            this.getRate(this.authService.currentUser.currency.currency, this.authService.currency.currency);

            const popover = this.navParams.get('popover');
            popover.dismiss({
                currency: c.currency,
                icon: Currencies[c.currency]
            });
        }
    }

    getRate(c1, c2) {
        return this.cuService.convertCurrency(c1, c2)
            .subscribe(
                response => {
                    this.cuService.rate = parseFloat(Object.entries(response)[0][1].toFixed(3));
                    this.storageService.setObject('rate', {
                        rate: this.cuService.rate
                    });
                    console.log('service rate', this.cuService.rate);
                }
            );
    }
}
