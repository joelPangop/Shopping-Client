import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Events} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    API_KEY = '7488255780c23c61f7a6';

    fromCurrOptionSubject;
    toCurrOptionSubject;
    // @ts-ignore
    currRateOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    showLoadingSpining: boolean = false;
    cad_rate;

    constructor(public http: HttpClient, private event: Events) {
    }

    getCountries() {
        return this.http.get(`https://free.currencyconverterapi.com/api/v6/currencies?apiKey=${this.API_KEY}`).toPromise();
    }

    getExchangeRate(from, to) {
        return this.http.get(`http://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=y&apiKey=${this.API_KEY}`).toPromise();
    }

    async getCurrencyRate() {
        let res = false;
        try {
            const exchangeRate = await this.getExchangeRate(this.fromCurrOptionSubject, this.toCurrOptionSubject);
            let rate = exchangeRate[this.fromCurrOptionSubject + '_' + this.toCurrOptionSubject].val;
            this.event.publish('rate', rate);
            this.showLoadingSpining = false;
            this.event.publish('showLoadingSpining', false);
            res = true;
            this.currRateOptionSubject.next(rate);
        } catch (err) {
            console.error(err);
        }
        return res;
    }

}
