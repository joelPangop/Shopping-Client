import { Component, OnInit } from '@angular/core';
declare var Stripe;
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-stripe-web',
  templateUrl: './stripe.page.html',
  styleUrls: ['./stripe.page.scss'],
})
export class StripePage implements OnInit {
  stripe = Stripe('pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha');
  card: any;
  paymentAmount: string = '0.1';
  currency: string = 'USD';
  currencyIcon: string = '$';

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
   let activeParams = this.activatedRoute.snapshot.paramMap.get('params');
   const params = JSON.parse(activeParams);
   console.log('params', params);
   // this.paymentAmount = params.paymentAmount;
   this.currency = params.currency;
   this.currencyIcon = params.currencyIcon;
  }

  ngOnInit() {
    this.setupStripe();
  }

  setupStripe() {
    let elements = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });
    console.log(this.card);
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log(event);

      this.stripe.createSource(this.card).then(result => {
        if (result.error) {
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
          this.makePayment(result);
        }
      });
    });
  }

  makePayment(token) {
    this.http
        .post('http://192.168.2.58:5000/egoal-shopping/us-central1/payWithStripe', {
          token: token.id
        })
        .subscribe(data => {
          console.log(data);
        });
  }

}
