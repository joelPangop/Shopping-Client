import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {StorageService} from './storage.service';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    protected baseUrl: string;
    protected chartUrl: string;
    protected apiKey: string;

    public rate: number;
    public currency: any = {};

    constructor(private http: HttpClient, private storageService: StorageService, private authService: AuthService) {
        this.baseUrl = 'https://free.currconv.com/api/v7';
        this.chartUrl = 'https://www.google.com/finance/chart?q=CURRENCY';
        this.apiKey = 'apiKey=4992f41ba9373eb0e7e6';
        this.storageService.getObject('rate').then((res: any) => {
            if (res) {
                this.rate = res.rate;
            } else {
                this.rate = 1;
            }
        });
        // this.storageService.getObject('currency').then((res: any) => {
        //     if (res) {
        //         this.currency = res.currency;
        //     } else {
        //         if (this.authService.currentUser) {
        //             this.currency = this.authService.currentUser.currency;
        //         } else {
        //             this.currency = {currency: 'CAD', icon: 'flag-for-flag-canada'};
        //         }
        //     }
        // });

    }

    convertCurrency(c1: string, c2: string) {
        return this.http.get(`${this.baseUrl}/convert?q=${c1}_${c2}&compact=ultra&${this.apiKey}`)
            .pipe(map(response => response));
    }

    fetchCurrencies() {
        return this.http.get(`${this.baseUrl}/currencies?${this.apiKey}`)
            .pipe(map(response => response));
    }

    fetchChart(c1: string, c2: string) {
        return `${this.chartUrl}:${c1.toUpperCase()}${c2.toUpperCase()}&chst=vkc&tkr=1&chsc=2&chs=270x94&p=5Y`;
    }

}
