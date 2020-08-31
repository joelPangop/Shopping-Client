import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Platform, ToastController} from '@ionic/angular';
import {PaymentMethods} from '../../models/PaymentMethods';
import {Stripe} from '@ionic-native/stripe/ngx';
import {PaymentService} from '../../services/payment.service';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-souscription',
    templateUrl: './souscription.page.html',
    styleUrls: ['./souscription.page.scss'],
})
export class SouscriptionPage implements OnInit {
    subscriptionForm: FormGroup;
    // cardNumber: string = '4519932089046981';
    // cardName: string = 'JOEL STEPHANE P TCHOMENI';
    // mm: string = '10';
    // yy: string = '22';
    // cvc: string = '290';

    cardNumber: string = '4242424242424242';
    cardName: string = 'TEST ';
    mm: string = '08';
    yy: string = '21';
    cvc: string = '456';
    cc: Boolean = false;
    paypal: Boolean = false;
    paymentAmount: any;
    currencyIcon: any;
    cards: Map<string, string>;
    stripe_key = 'pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha';

    constructor(public authService: AuthService, public formBuilder: FormBuilder, private stripe: Stripe,
                public platform: Platform, private paymentService: PaymentService, private toastCtrl: ToastController,
                private storage: StorageService) {
        // this.subscriptionForm = this.formBuilder.group({
        //     // email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        //     password: ['', [Validators.required, Validators.minLength(6),
        //         Validators.maxLength(30)]],
        //     passwordConfirm: new FormControl('', [
        //         Validators.required,
        //         Validators.minLength(6),
        //         Validators.maxLength(30),
        //     ])
        // }, {validator: this.password});
        this.cards = new Map<string, string>();
        // this.cardNumber = '';
    }

    ngOnInit() {
        for (const item in PaymentMethods) {
            this.cards.set(item, PaymentMethods[item]);
        }
    }

    password(formGroup: FormGroup): { [err: string]: any } {
        console.log('password', formGroup.get('password').value);
        console.log('confirm password', formGroup.get('passwordConfirm').value);
        return formGroup.get('password').value === formGroup.get('passwordConfirm').value ? null : {passwordMismatch: true};
    }
    //
    // retryInvoiceWithNewPaymentMethod(paymentMethodId, invoiceId) {
    //     const priceId = productSelected.name.toUpperCase();
    // }

    showPaymentOption(option) {
        switch (option) {
            case 'VISA':
            case 'MASTERCARD':
                this.cc = true;
                this.paypal = false;
                break;
            case 'PAYPAL':
                this.cc = false;
                this.paypal = true;
                let _this = this;
                // setTimeout(() => {
                //   // Render the PayPal button into #paypal-button-container
                //   <any> window['paypal'].Buttons({
                //
                //     // Set up the transaction
                //     createOrder: function(data, actions) {
                //       return actions.order.create({
                //         purchase_units: [{
                //           amount: {
                //             value: _this.paymentAmount
                //           }
                //         }]
                //       });
                //     },
                //
                //     // Finalize the transaction
                //     onApprove: function(data, actions) {
                //       return actions.order.capture()
                //           .then(function(details) {
                //             // Show a success message to the buyer
                //             alert('Transaction completed by ' + details.payer.name.given_name + '!');
                //           })
                //           .catch(err => {
                //             console.log(err);
                //           });
                //     }
                //   }).render('#paypal-button-container');
                // }, 500);
                break;
        }
    }

    async createPayment() {
        const cardDetails = {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2020,
            cvc: '220'
        };
        // const cardDetails = {
        //     number: this.cardNumber,
        //     exp_month: this.mm,
        //     exp_year: this.yy,
        //     cvc: this.cvc
        // };
        // await this.stripe.setPublishableKey('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');
        // this.stripe.validateCardNumber(this.cardNumber).then(r => console.log('valid number')).catch(err => {
        //     this.presentToast('Number not valid', 1500);
        // });

        this.paymentService.createPayment(cardDetails, this.authService.currentUser).subscribe((res: any) => {
            console.log(res);
            let subscription = res.subscription;
            this.storage.setObject('latestInvoiceId', subscription.latest_invoice);
        });
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }

    soubscribe(form) {
        console.log(form);
    }

    payWithStripe() {
        this.stripe.setPublishableKey(this.stripe_key);
        // this.cardDetails = {
        //     number: '4242424242424242',
        //     expMonth: 12,
        //     expYear: 2020,
        //     cvc: '220'
        // };
        //
        // const result = this.stripe.createCardToken(this.cardDetails)
        //     .then(token => {
        //         console.log(token);
        //         this.makePayment(token.id);
        //     })
        //     .catch(error => console.error(error));

    }

    payWithPaypal() {

    }
}
