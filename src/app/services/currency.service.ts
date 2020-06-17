import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    API_KEY = '7488255780c23c61f7a6';

    fromCurrOptionSubject;
    toCurrOptionSubject;
    // @ts-ignore
    currRateOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    private showLoadingSpinningSubject = new Subject<boolean>();

    private rateSubject = new Subject<any>();

    constructor(public http: HttpClient) {
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
            let rate = '';
            rate = exchangeRate[this.fromCurrOptionSubject + '_' + this.toCurrOptionSubject].val;
            this.rateSubject.next(rate);
            this.showLoadingSpinningSubject.next(false);
            // this.event.publish('showLoadingSpining', false);
            res = true;
            this.currRateOptionSubject.next(rate);
        } catch (err) {
            console.error(err);
        }
        return res;
    }

    getRateObservable(): Subject<any> {
        return this.rateSubject;
    }

    getShowLoadingSpinningSubjectObservale(): Subject<boolean> {
        return this.showLoadingSpinningSubject;
    }

    setShowLoadingSpinningSubjectObservale(value){
        this.showLoadingSpinningSubject.next(value);
    }

}
