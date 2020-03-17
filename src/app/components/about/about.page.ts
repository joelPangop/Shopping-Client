import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

    credit_cards: any[];

    activeParam: string;

    constructor(private activatedRoute: ActivatedRoute) {
        this.activeParam = this.activatedRoute.snapshot.paramMap.get('param');
    }

    ngOnInit() {
        this.credit_cards = [
            {
                brand: 'Visa',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'Visa (debit)',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'Mastercard',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'Mastercard (2-series)',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'Mastercard (debit)',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'Mastercard (prepaid)',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'American Express',
                cvc: 'Any 4 digits',
                date: 'Any future date'
            },
            {
                brand: 'Discover',
                cvc: 'Any 4 digits',
                date: 'Any future date'
            },
            {
                brand: 'Diners Club',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'Diners Club (14 digit card)',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'JCB',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            },
            {
                brand: 'UnionPay',
                cvc: 'Any 3 digits',
                date: 'Any future date'
            }
        ];
    }

}
