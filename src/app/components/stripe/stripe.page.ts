import { Component } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-stripe',
  templateUrl: 'stripe.page.html',
  styleUrls: ['stripe.page.scss'],
})
export class StripePage {
  paymentAmount: string = '3.33';
  currency: string = 'USD';
  currencyIcon: string = '$';
  stripe_key = 'pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha';
  cardDetails: any = {};

  constructor(private stripe: Stripe, private http: HttpClient) {
  }

  payWithStripe() {
    this.stripe.setPublishableKey(this.stripe_key);

    this.cardDetails = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    }

    this.stripe.createCardToken(this.cardDetails)
        .then(token => {
          console.log(token);
          this.makePayment(token.id);
        })
        .catch(error => console.error(error));
  }

  makePayment(token) {
    this.http
        .post('http://localhost:5000/egoal-shopping/us-central1/payWithStripe', {
          token: token.id
        })
        .subscribe(data => {
          console.log(data);
        });
  }
}
