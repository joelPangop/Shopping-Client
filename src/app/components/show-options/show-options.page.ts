import {Component, OnInit} from '@angular/core';
import {Events, NavController, NavParams} from '@ionic/angular';
import {CategorieTelephone} from '../../models/CategorieTelephone';
import {Languages} from '../../models/Languages';
import {Currencies} from '../../models/Currencies';
import {forEach} from '@angular-devkit/schematics';
import {BehaviorSubject} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {ArticleService} from '../../services/article.service';
import {CurrencyService} from '../../services/currency.service';

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
                private event: Events) {
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

    setCurrency(c: string) {
        this.currency = c;
        this.event.publish('showLoadingSpining', true);
        console.log(this.currency);
        this.currOptionSubject.next(this.currency);
        this.currIconOptionSubject.next(Currencies[this.currency]);
        this.cuService.toCurrOptionSubject = this.currency;
        this.cuService.getCurrencyRate().then( (res) => {
          if(res){
              const popover = this.navParams.get('popover');
              popover.dismiss(Currencies[this.currency]);
          }
        });
    }

}
