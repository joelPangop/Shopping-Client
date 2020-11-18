import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, NavController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {PaymentMethods} from '../../models/PaymentMethods';
import {Stripe} from '@ionic-native/stripe/ngx';
import {PaymentService} from '../../services/payment.service';
import {StorageService} from '../../services/storage.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import * as moment from 'moment';
import {PayPal, PayPalPayment, PayPalConfiguration} from '@ionic-native/paypal/ngx';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {Currencies} from '../../models/Currencies';
import {BehaviorSubject} from 'rxjs';

const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    selector: 'app-souscription',
    templateUrl: './souscription.page.html',
    styleUrls: ['./souscription.page.scss'],
})
export class SouscriptionPage implements OnInit {
    subscriptionForm: FormGroup;
    bankForm: FormGroup;
    cardInfoForm: FormGroup;
    // cardNumber: string = '4519932089046981';
    // cardName: string = 'JOEL STEPHANE P TCHOMENI';
    // mm: string = '10';
    // yy: string = '22';
    // cvc: string = '290';
    utilisateur: Utilisateur;
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
    stripe_key = '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';
    stripe_key_test = 'sk_test_uDpsb45Q2RafPC94m1LKGYt800b1sJ6Aa5';
    prof_price_plan = 'price_1Hg9gzE9FSiwzakmuRQD0W1k';
    ind_price_plan = 'price_1Hg9fIE9FSiwzakm1ZQPexbc';
    saler_plan = 'price_1HYavwE9FSiwzakm4jPO7Gtw';
    option: string = '';
    steps: any = [];
    user_informations: boolean = false;
    company_informations: boolean = false;
    subscription_plan: any;
    bank_plan: any[];
    msg_err: string = '';
    validation_messages: any = {};
    public imgURL: any;
    private message: string;
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    company_image: any;

    constructor(public authService: AuthService, public formBuilder: FormBuilder, private stripe: Stripe, private payPal: PayPal,
                public platform: Platform, private paymentService: PaymentService, private toastCtrl: ToastController,
                private storage: StorageService, private alertController: AlertController, private navCtrl: NavController,
                private popoverController: PopoverController) {
        this.subscriptionForm = this.formBuilder.group({
            email: [authService.currentUser.email, Validators.compose([
                Validators.pattern(PURE_EMAIL_REGEXP),
                Validators.required
            ])],
            company_email: ['', Validators.compose([
                Validators.pattern(PURE_EMAIL_REGEXP),
                Validators.required
            ])],
            option: ['', [Validators.required]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            company_name: ['', [Validators.required]],
            addr_1: ['', [Validators.required]],
            company_addr_1: ['', [Validators.required]],
            appNumber: [''],
            company_appNumber: [''],
            addr_2: [''],
            company_addr_2: [''],
            city: ['', [Validators.required]],
            company_city: ['', [Validators.required]],
            phone: [''],
            company_phone: ['', [Validators.required]],
            state: ['', [Validators.required]],
            company_state: ['', [Validators.required]],
            country: ['', [Validators.required]],
            company_country: ['', [Validators.required]],
            business_number: [''],
            business_website: [''],
            vat_number: [''],
            zipcode: ['', [Validators.required]],
            company_zipcode: ['', [Validators.required]],
            cardName: ['', [Validators.required]],
            cardNumber: ['', [Validators.required]],
            exp_month: ['', [Validators.required]],
            exp_year: ['', [Validators.required]],
            cvv: ['', [Validators.required]],
            image: [''],
            comp_image: [''],
            full_name: ['', [Validators.required]],
            currency: ['', [Validators.required]],
            bank_country: ['', [Validators.required]],
            account_holder_name: ['', [Validators.required]],
            account_holder_type: ['', [Validators.required]],
            routing_number: ['', Validators.compose([
                // Validators.pattern(/^\d{5}-\d{3}$/ + "|" +/^[0-9]*$/ ),
                // Validators.pattern(/^[0-9]*$/),
                Validators.required
            ])],
            account_number: ['', Validators.compose([
                Validators.pattern(/^[0-9]*$/),
                Validators.required
            ])],
            birthday: ['', [Validators.required]],
        }, {validator: this.birthdayValidator});

        this.cards = new Map<string, string>();
        // this.cardNumber = '';
    }

    ionViewWillEnter() {
        this.steps = [
            {
                step: 'Status',
                isSelected: true
            },
            {
                step: 'Billing',
                isSelected: false
            },
            {
                step: 'Payment',
                isSelected: false
            },
            {
                step: 'Bank Informations',
                isSelected: false
            },
            {
                step: 'Confirm',
                isSelected: false
            }
        ];
        this.authService.getUserById(this.authService.currentUser._id).subscribe((res) => {
            this.utilisateur = res;
            if (this.utilisateur.customer_profile.subscriptions) {
                for (const subscription of this.utilisateur.customer_profile.subscriptions.data) {
                    if (subscription.plan.nickname == 'Professionnel' || subscription.plan.nickname == 'Individuel') {
                        this.subscription_plan = subscription;
                        this.subscriptionForm.get('option').setValue(subscription.plan.nickname);
                        this.option = subscription.plan.nickname;
                    }
                }
            }
        });
    }

    ngOnInit() {
        this.steps = [
            {
                step: 'Status',
                isSelected: true
            },
            {
                step: 'Billing',
                isSelected: false
            },
            {
                step: 'Payment',
                isSelected: false
            },
            {
                step: 'Bank Informations',
                isSelected: false
            },
            {
                step: 'Confirm',
                isSelected: false
            }
        ];

        this.authService.getUserById(this.authService.currentUser._id).subscribe((res) => {
            this.utilisateur = res;

            if (this.utilisateur.customer_profile.subscriptions) {
                for (const subscription of this.utilisateur.customer_profile.subscriptions.data) {
                    if (subscription.plan.nickname == 'Professionnel' || subscription.plan.nickname == 'Individuel') {
                        this.subscription_plan = subscription;
                        this.subscriptionForm.get('option').setValue(subscription.plan.nickname);
                        this.option = subscription.plan.nickname;
                    }
                }
            }
        });
        for (const item in PaymentMethods) {
            this.cards.set(item, PaymentMethods[item]);
        }

        this.imgURL = 'assets/images/no_profile.png';
        this.company_image = 'assets/images/no_profile.png';
        this.validation_messages = {
            first_name: [
                {type: 'required', message: 'First name is required.'},
            ],
            last_name: [
                {type: 'required', message: 'Last name is required.'},
            ],
            email: [
                {type: 'required', message: 'Email is required.'}
            ],
            addr_1: [
                {type: 'required', message: 'Address is required.'},
            ],
            city_val: [
                {type: 'required', message: 'city is required.'},
            ],
            state_val: [
                {type: 'required', message: 'state is required.'}
            ],
            country_val: [
                {type: 'required', message: 'country is required.'}
            ],
            zipcode: [
                {type: 'required', message: 'Postal code is required.'}
            ],
            company_name: [
                {type: 'required', message: 'Name is required.'},
            ],
            company_email: [
                {type: 'required', message: 'Company email is required.'}
            ],
            company_addr_1: [
                {type: 'required', message: 'Company location address is required.'},
            ],
            company_city: [
                {type: 'required', message: 'Company location city is required.'},
            ],
            company_state: [
                {type: 'required', message: 'Company location state is required.'}
            ],
            company_country: [
                {type: 'required', message: 'Company location country is required.'}
            ],
            company_zipcode: [
                {type: 'required', message: 'Company postal code is required.'}
            ],
            company_phone: [
                {type: 'required', message: 'Phone number is required.'}
            ],
            cardName: [
                {type: 'required', message: 'Card name is required.'}
            ],
            cardNumber: [
                {type: 'required', message: 'Card number is required.'}
            ],
            exp_month: [
                {type: 'required', message: 'Expiration month is required.'}
            ],
            exp_year: [
                {type: 'required', message: 'Expiration year is required.'}
            ],
            cvv: [
                {type: 'required', message: 'cvv is required.'}
            ],
            full_name: [
                {type: 'required', message: 'Full name is required.'},
            ], routing_number: [
                {type: 'required', message: 'Routing number is required.'},
                {type: 'pattern', message: 'Routing number format not correct.'}
            ],
            currency: [
                {type: 'required', message: 'currency is required.'}
            ],
            account_holder_name: [
                {type: 'required', message: 'Account holder name is required.'}
            ],
            account_number: [
                {type: 'required', message: 'Account number is required.'},
                {type: 'pattern', message: 'Account number format not correct.'}
            ],
            birthday: [
                {type: 'required', message: 'Birthday is required.'},
                {type: 'birthdayValidator', message: 'Birthday must be previous than the present date.'}
            ]
        };

        this.subscriptionForm.get('cardNumber').setValue(4242424242424242);
        this.subscriptionForm.get('cardName').setValue('test');
        this.subscriptionForm.get('exp_month').setValue(12);
        this.subscriptionForm.get('exp_year').setValue(2020);
        this.subscriptionForm.get('cvv').setValue(220);

    }

    birthdayValidator(formGroup: FormGroup): { [err: string]: any } {
        return new Date(formGroup.get('birthday').value) < new Date() ? null : {birthdayNotCorrect: true};
    }

    isSubmitted = false;

    get errorControl() {
        return this.subscriptionForm.controls;
    }

    fileData: any;

    async onFileSelect(event) {
        this.imgURL = [];
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            let data: any;
            data = new FormData();
            data.append('file', event.target.files[0]);
            data.append('purpose', 'identity_document');
            const fileResult = await fetch('https://uploads.stripe.com/v1/files', {
                method: 'POST',
                headers: {'Authorization': 'Bearer pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha'},
                body: data,
            });
            this.fileData = await fileResult.json();
            this.preview(file, 1);
        }
    }

    async onCompanyFileSelect(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            let data: any;
            data = new FormData();
            data.append('file', event.target.files[0]);
            data.append('purpose', 'identity_document');
            const fileResult = await fetch('https://uploads.stripe.com/v1/files', {
                method: 'POST',
                headers: {'Authorization': 'Bearer pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha'},
                body: data,
            });
            this.company_image = await fileResult.json();
            this.preview(file, 2);
        }
    }

    preview(files, pos: number) {
        const mimeType = files.type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = 'Only images are supported.';
            return;
        }

        // tslint:disable-next-line:prefer-const
        const reader = new FileReader();
        // this.imagePath = files;
        reader.readAsDataURL(files);
        // tslint:disable-next-line:variable-name
        reader.onload = (_event) => {
            switch (pos) {
                case 1:
                    this.imgURL = reader.result;
                    break;
                case 2:
                    this.company_image = reader.result;
                    break;
            }
        };
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
            name: this.subscriptionForm.value.cardName,
            number: this.subscriptionForm.value.cardNumber,
            exp_month: this.subscriptionForm.value.exp_month,
            exp_year: this.subscriptionForm.value.exp_year,
            cvc: this.subscriptionForm.value.cvv
        };
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

    chooseOption() {
        console.log(this.subscriptionForm.value.option);
        this.option = this.subscriptionForm.value.option;
    }

    subscribe() {
        this.isSubmitted = true;
        if (!this.subscription_plan) {
            this.submitSubscription();
        } else {
            this.msg_err = 'You are already subscribed to ' + this.subscription_plan.plan.nickname + ' plan and it expire on ' + this.getMomentForMobile(this.subscription_plan.current_period_end) +
                ', unsubscribe first before subscribe to another plan';
        }
    }

    submitSubscription() {
        const address_detail = {
            name: this.subscriptionForm.value.company_name,
            line1: this.subscriptionForm.value.company_addr_1,
            city: this.subscriptionForm.value.company_city,
            country: this.subscriptionForm.value.company_country,
            phone: this.subscriptionForm.value.company_phone,
            state: this.subscriptionForm.value.company_state,
            appNumber: this.subscriptionForm.value.company_appNumber,
            email: this.subscriptionForm.value.company_email,
            zipcode: this.subscriptionForm.value.company_zipcode,
            business_number: this.subscriptionForm.value.business_number,
            business_website: this.subscriptionForm.value.business_website,
            vat_number: this.subscriptionForm.value.vat_number,
            image: this.company_image,
        };

        const cardDetails = {
            number: this.subscriptionForm.value.cardNumber,
            exp_month: this.subscriptionForm.value.exp_month,
            exp_year: this.subscriptionForm.value.exp_year,
            cvc: this.subscriptionForm.value.cvv
        };

        const bankDetails = {
            account_holder_name: this.subscriptionForm.get('account_holder_name').value,
            account_holder_type: this.subscriptionForm.get('account_holder_type').value,
            routing_number: this.subscriptionForm.get('routing_number').value,
            account_number: this.subscriptionForm.get('account_number').value,
            currency: this.subscriptionForm.get('currency').value,
            country: this.subscriptionForm.get('country').value,
        };

        const personal_infos = {
            first_name: this.subscriptionForm.value.first_name,
            last_name: this.subscriptionForm.value.last_name,
            line1: this.subscriptionForm.value.addr_1,
            city: this.subscriptionForm.value.city,
            country: this.subscriptionForm.value.country,
            phone: this.subscriptionForm.value.phone,
            state: this.subscriptionForm.value.state,
            appNumber: this.subscriptionForm.value.appNumber,
            email: this.subscriptionForm.value.email,
            zipcode: this.subscriptionForm.value.zipcode,
            birthday: this.subscriptionForm.value.birthday,
            image: this.fileData
        };

        this.authService.getUserById(this.utilisateur._id).subscribe((res) => {
            if (res.customer_profile.subscriptions.data.length > 0 && (res.customer_profile.subscriptions.data.plan.nickname == 'Professionnel' || res.customer_profile.subscriptions.data.plan.nickname == 'Individuel')) {
                this.presentToast('Already a subscribed plan. May be you have to refresh your page', 2000);
            } else {
                this.paymentService.createPlan(this.ind_price_plan, this.authService.currentUser, this.option, cardDetails, address_detail, bankDetails, personal_infos).subscribe(async (res) => {
                    console.log(res);
                    await this.storage.setObject('Utilisateur', res.user);
                    this.authService.currentUser = res.user;
                    this.subscription_plan = res.subscription;
                    this.steps[0].isSelected = false;
                    this.steps[1].isSelected = false;
                    this.steps[2].isSelected = false;
                    this.steps[3].isSelected = false;
                    this.steps[4].isSelected = true;
                });
            }
        });
    }

    // Go to xext section function
    next() {
        // If current section is billing then next payment section will be visible
        if (this.steps[0].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = true;
            this.steps[2].isSelected = false;
            this.steps[3].isSelected = false;
        }
        // If current section is Billing then next section confirm will be visible
        else if (this.steps[1].isSelected) {
            console.log('birthday', this.subscriptionForm.value.birthday);
            console.log('birthday day', new Date(this.subscriptionForm.value.birthday).getUTCDate());
            console.log('birthday month', new Date(this.subscriptionForm.value.birthday).getMonth() + 1);
            console.log('birthday year', new Date(this.subscriptionForm.value.birthday).getFullYear());
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = true;
            this.steps[3].isSelected = false;
        } else if (this.steps[2].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = false;
            this.steps[3].isSelected = true;
        }
    }

    back() {
        if (this.steps[1].isSelected) {
            this.steps[0].isSelected = true;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = false;
            this.steps[3].isSelected = false;
        } else if (this.steps[2].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = true;
            this.steps[2].isSelected = false;
            this.steps[3].isSelected = false;
        } else if (this.steps[3].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = true;
            this.steps[3].isSelected = false;
        }
    }

    gotoStatus() {
        this.steps[0].isSelected = true;
        this.steps[1].isSelected = false;
        this.steps[2].isSelected = false;
        this.steps[3].isSelected = false;
        this.steps[4].isSelected = false;
    }

    use_information_toggle() {
        console.log(this.user_informations);
        if (this.user_informations) {
            this.subscriptionForm.get('first_name').setValue(this.utilisateur.userInfo.firstName);
            this.subscriptionForm.get('last_name').setValue(this.utilisateur.userInfo.lastName);
            this.subscriptionForm.get('addr_1').setValue(this.utilisateur.userInfo.address.roadName);
            this.subscriptionForm.get('appNumber').setValue(this.utilisateur.userInfo.address.appartNumber);
            this.subscriptionForm.get('city').setValue(this.utilisateur.userInfo.address.town);
            this.subscriptionForm.get('phone').setValue(this.utilisateur.userInfo.telephones[0].numeroTelephone);
            this.subscriptionForm.get('state').setValue(this.utilisateur.userInfo.address.region);
            this.subscriptionForm.get('zipcode').setValue(this.utilisateur.userInfo.address.postalCode);
            this.subscriptionForm.get('country').setValue(this.utilisateur.userInfo.address.country);
        } else {
            this.subscriptionForm.get('first_name').setValue('');
            this.subscriptionForm.get('last_name').setValue('');
            this.subscriptionForm.get('addr_1').setValue('');
            this.subscriptionForm.get('appNumber').setValue('');
            this.subscriptionForm.get('city').setValue('');
            this.subscriptionForm.get('phone').setValue('');
            this.subscriptionForm.get('state').setValue('');
            this.subscriptionForm.get('zipcode').setValue('');
            this.subscriptionForm.get('country').setValue('');
        }
    }

    company_information_toggle() {
        console.log(this.company_informations);
        if (this.company_informations) {
            this.subscriptionForm.get('company_name').setValue(this.utilisateur.userInfo.firstName);
            this.subscriptionForm.get('company_addr_1').setValue(this.utilisateur.userInfo.address.roadName);
            this.subscriptionForm.get('company_appNumber').setValue(this.utilisateur.userInfo.address.appartNumber);
            this.subscriptionForm.get('company_city').setValue(this.utilisateur.userInfo.address.town);
            this.subscriptionForm.get('company_phone').setValue(this.utilisateur.userInfo.telephones[0].numeroTelephone);
            this.subscriptionForm.get('company_state').setValue(this.utilisateur.userInfo.address.region);
            this.subscriptionForm.get('company_zipcode').setValue(this.utilisateur.userInfo.address.postalCode);
            this.subscriptionForm.get('company_country').setValue(this.utilisateur.userInfo.address.country);
            this.subscriptionForm.get('company_phone').setValue(this.utilisateur.userInfo.telephones[0].numeroTelephone);
        } else {
            this.subscriptionForm.get('company_name').setValue('');
            this.subscriptionForm.get('company_addr_1').setValue('');
            this.subscriptionForm.get('company_appNumber').setValue('');
            this.subscriptionForm.get('company_city').setValue('');
            this.subscriptionForm.get('company_phone').setValue('');
            this.subscriptionForm.get('company_state').setValue('');
            this.subscriptionForm.get('company_zipcode').setValue('');
            this.subscriptionForm.get('company_country').setValue('');
            this.subscriptionForm.get('company_phone').setValue('');
        }
    }

    async handleUnSubscription($event) {
        const alert = await this.alertController.create({
            message: 'Unsubscribe...',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('No');
                    }
                },
                {
                    text: 'Now',
                    role: 'OK',
                    handler: () => {
                        console.log('Now');
                        this.handleUnSubscribeTime('Now');
                    }
                },
                {
                    text: 'At the end of this period',
                    role: 'OK',
                    handler: () => {
                        console.log('At the end of this period');
                        this.handleUnSubscribeTime('End');
                    }
                }]
        });
        return alert.present().then(r => {
            console.log('res:', r);
        });
    }

    async handleUnSubscribeTime(time: string) {
        const alert = await this.alertController.create({
            message: 'Confirmation',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('No');
                    }
                },
                {
                    text: 'Yes',
                    role: 'OK',
                    handler: () => {
                        console.log('Yes');
                        this.unSubscription(time);
                    }
                }]
        });
        return alert.present().then(r => {
            console.log('res:', r);
        });
    }

    unSubscription(time: string) {
        console.log('now', this.getMomentForMobile(Date.now()));

        const time1 = new Date(this.subscription_plan.current_period_end * 1000).getTime();
        const time2 = new Date(this.subscription_plan.current_period_start * 1000).getTime();
        console.log('start period', this.getMomentForMobile(time2));
        console.log('end period', this.getMomentForMobile(time1));
        if (this.subscription_plan.cancel_at_period_end === true && time === 'End') {
            this.msg_err = 'The cancellation already set to end of the period: ' + this.getMomentForMobile(time1);
        } else if (time === 'End') {
            this.paymentService.cancelSubscription(this.subscription_plan.id, time, this.authService.currentUser.email).subscribe(async (res) => {
                console.log(res);
                await this.storage.setObject('Utilisateur', res.user);
                this.authService.currentUser = res.user;
                this.subscription_plan = res.subscription;
                this.presentToast('Successfully cancelled for the end of the period', 1500);
            });
        } else if (time === 'Now') {
            this.paymentService.cancelSubscription(this.subscription_plan.id, time, this.authService.currentUser.email).subscribe(async (res) => {
                console.log(res);
                await this.storage.setObject('Utilisateur', res.user);
                this.authService.currentUser = res.user;
                this.subscription_plan = undefined;
                this.option = '';
                this.subscriptionForm.get('option').setValue('');
                this.presentToast('Successfully directly cancelled', 1500);
            });
        }
    }

    getMomentForMobile(date: any) {
        return moment(date).format('lll');
    }

    close_msg() {
        this.msg_err = '';
    }

    test($event) {
        console.log('form status', this.subscriptionForm.valid);
    }

    goToBank() {
        this.navCtrl.navigateForward('menu/tabs/bank');
    }

    public async setCurrency(ev) {
        // @ts-ignore
        const popover = await this.popoverController.create({
            component: ShowOptionsPage,
            event: ev,
            translucent: true,
            cssClass: 'popover-currency',
            componentProps: {
                currOptionSubject: this.currOptionSubject,
                currIconOptionSubject: this.currIconOptionSubject,
                currency: this.utilisateur.currency ? this.utilisateur.currency.currency : 'CAD',
                currencyIcon: this.utilisateur.currency ? this.utilisateur.currency.icon : 'assets/' + Currencies.CAD + '.svg',
                option: 'currency'
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                if (data.data) {
                    console.log(data.data);
                    this.subscriptionForm.get('currency').setValue(data.data.currency);
                }
            });
        return await popover.present();
    }
}
