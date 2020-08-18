import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, Platform} from '@ionic/angular';
import {PaymentMethods} from '../../models/PaymentMethods';
import {PayPal, PayPalConfiguration, PayPalPayment} from '@ionic-native/paypal/ngx';
import {CommandeService} from '../../services/commande.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Stripe} from '@ionic-native/stripe/ngx';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

    steps: any = [];
    cards: Map<string, string>;
    cc: Boolean = false;
    paypal: Boolean = false;
    paymentAmount: string = '0.5';
    utilisateur = {} as Utilisateur;
    stripe_key = 'pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha';
    card: any;
    // stripe_key = "pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha";
    cardDetails: any = {};
    currency: string = 'CAD';
    currencyIcon: string = '$';

    constructor(public modalController: ModalController, private cmdService: CommandeService, private stripe: Stripe,
                private router: Router, private payPal: PayPal, private userStorageUtils: UserStorageUtils,
                private http: HttpClient, public platform: Platform) {

    }

    //
    // payWithStripe() {
    //     this.stripe.setPublishableKey(this.stripe_key);
    //
    //
    //
    //     this.stripe.createCardToken(this.cardDetails)
    //         .then(token => {
    //             console.log(token);
    //             // this.makePayment(token.id);
    //         })
    //         .catch(error => console.error(error));
    // }

    async ngOnInit() {
        console.log(this.platform.platforms());
        // Checkout steps
        this.steps = [
            {
                step: 'Billing',
                isSelected: true
            },
            {
                step: 'Payment',
                isSelected: false
            },
            {
                step: 'Confirm',
                isSelected: false
            }
        ];
        this.cards = new Map<string, string>();
        this.utilisateur = await this.userStorageUtils.getUser();

        // Payment cards images

        for (const item in PaymentMethods) {
            this.cards.set(item, PaymentMethods[item]);
        }
        console.log(this.cards);
        // this.paymentAmount = '' + this.cmdService.commande.amount;
        // this.cards = ["assets/images/cards/visa.png",
        //   "assets/images/cards/mastercard.png",
        //   "assets/images/cards/paypal.png"]
    }

    payWithStripe() {
        this.stripe.setPublishableKey(this.stripe_key);
        this.cardDetails = {
            number: '4242424242424242',
            expMonth: 12,
            expYear: 2020,
            cvc: '220'
        };

        const result = this.stripe.createCardToken(this.cardDetails)
            .then(token => {
                console.log(token);
                this.makePayment(token.id);
            })
            .catch(error => console.error(error));

    }

    makePayment(token) {
        this.http
            .post('https://us-central1-shoppr-c97a7.cloudfunctions.net/payWithStripe', {
                token: token.id
            })
            .subscribe(data => {
                console.log(data);
            });
    }

    payWithPaypal() {
        console.log('Pay ????');
        this.payPal.init({
            PayPalEnvironmentProduction: 'pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha',
            PayPalEnvironmentSandbox: 'AW_6b6jtwQ-erzTNpij929f3--m_jXImBcHdhYI_n_hom6Nv7EgIewumGIuua9W8x1TTqZQz_BLYWv2H'
        }).then(() => {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
                // Only needed if you get an "Internal Service Error" after PayPal login!
                //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
            })).then(() => {
                let payment = new PayPalPayment(this.paymentAmount, this.currency, 'Description', 'sale');
                this.payPal.renderSinglePaymentUI(payment).then((res) => {
                    console.log(res);
                    // Successfully paid

                    // Example sandbox response
                    //
                    // {
                    //   "client": {
                    //     "environment": "sandbox",
                    //     "product_name": "PayPal iOS SDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "sale"
                    //   }
                    // }
                }, () => {
                    // Error or render dialog closed without being successful
                });
            }, () => {
                // Error in configuration
            });
        }, () => {
            // Error in initialization, maybe PayPal isn't supported or something else
        });
    }

    // Go to xext section function
    next() {
        // If current section is billing then next payment section will be visible
        if (this.steps[0].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = true;
        }
        // If current section is Billing then next section confirm will be visible
        else if (this.steps[1].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = true;
        }
    }

    // Go to order page function
    gotoOrderPage() {
        this.dismiss();
        this.router.navigate(['/tabs/orders']);
    }

    // Go to product page
    gotoProductsPage() {
        this.dismiss();
        this.router.navigate(['/tabs/products']);
    }

    // Back to previous screen
    dismiss() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

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
                setTimeout(() => {
                    // Render the PayPal button into #paypal-button-container
                    <any> window['paypal'].Buttons({

                        // Set up the transaction
                        createOrder: function(data, actions) {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: _this.paymentAmount
                                    }
                                }]
                            });
                        },

                        // Finalize the transaction
                        onApprove: function(data, actions) {
                            return actions.order.capture()
                                .then(function(details) {
                                    // Show a success message to the buyer
                                    alert('Transaction completed by ' + details.payer.name.given_name + '!');
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    }).render('#paypal-button-container');
                }, 500);
                break;
        }
    }

}
