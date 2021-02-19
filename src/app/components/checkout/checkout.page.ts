import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ModalController, NavController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {PaymentMethods} from '../../models/PaymentMethods';
import {PayPal, PayPalConfiguration, PayPalPayment} from '@ionic-native/paypal/ngx';
import {CommandeService} from '../../services/commande.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Stripe} from '@ionic-native/stripe/ngx';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {PaymentService} from '../../services/payment.service';
import {itemCart} from '../../models/itemCart-interface';
import {environment} from '../../models/environements';
import {CurrencyService} from '../../services/currency.service';
import {Notification} from '../../models/notification-interface';
import {MessageService} from '../../services/message.service';
import {WebsocketService} from '../../services/websocket.service';
import {NotificationType} from '../../models/notificationType';
import {Article} from '../../models/article-interface';
import {CartService} from '../../services/cart.service';
import {StorageService} from '../../services/storage.service';
import {Commande} from '../../models/commande-interface';
import {UserInfo} from '../../models/userInfo-interface';
import {Address} from '../../models/address-interface';
import {Telephone} from '../../models/telephone-interface';
import {Plugins} from '@capacitor/core';
import {Device} from '../../models/device-interface';
import {OrderStatus} from '../../models/OrderStatus';
import {ArticleService} from '../../services/article.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

const {CapacitorVideoPlayer, Device} = Plugins;
const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    addrDetails: any = {};
    currency: string = 'CAD';
    currencyIcon: string = '$';
    checkoutForm: FormGroup;
    cardForm: FormGroup;
    addrForm: FormGroup;
    user_informations: any;
    amount;
    cartItems: itemCart[] = [];
    url = environment.api_url;
    total = 0;
    quantity: number;

    constructor(public modalController: ModalController, public cmdService: CommandeService, private stripe: Stripe,
                private router: Router, private payPal: PayPal, private userStorageUtils: UserStorageUtils, private toastCtrl: ToastController,
                private http: HttpClient, public platform: Platform, public formBuilder: FormBuilder, public cartService: CartService,
                public authService: AuthService, private paymentService: PaymentService, public cuService: CurrencyService,
                private activatedRoute: ActivatedRoute, public msgService: MessageService, private websocketService: WebsocketService,
                private storage: StorageService, private loadCtrl: LoadingController, private navCtrl: NavController,
                private articleService: ArticleService, private inAppBrowser: InAppBrowser) {

        this.cardForm = this.formBuilder.group({
            cardName: ['', [Validators.required]],
            cardNumber: ['', [Validators.required]],
            exp_month: ['', [Validators.required]],
            exp_year: ['', [Validators.required]],
            cvv: ['', [Validators.required]],
        });

        this.addrForm = this.formBuilder.group({
            email: ['', Validators.compose([
                Validators.pattern(PURE_EMAIL_REGEXP),
                Validators.required
            ])],
            name: ['', [Validators.required]],
            addr_1: ['', [Validators.required]],
            addr_2: [''],
            app: [''],
            phone: [''],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            country: ['', [Validators.required]],
            zipcode: ['', [Validators.required]],
        });
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
            },
            {
                step: 'Result',
                isSelected: false
            }
        ];
    }

    ionViewDidEnter() {
        this.activatedRoute.queryParams.subscribe(params => {
            // if (params && params.special) {
            if (params) {
                this.amount = params.totalAmount;
            }
        });
    }

    async ngOnInit() {
        console.log(this.platform.platforms());
        const queryParams = await this.activatedRoute.snapshot.queryParams as {};
        if (this.activatedRoute.snapshot.queryParams.token) {
            console.log(queryParams);
            const loading = await this.loadCtrl.create({
                message: 'Please wait...'
            });
            await loading.present();
            this.cmdService.loadCommande(this.authService.currentUser).subscribe((res) => {
                const commande = res;
                console.log(this.activatedRoute.snapshot.queryParams);
                const paymentInfos = {queryParams, commande: commande}
                this.paymentService.executePaypalPayment(paymentInfos, this.authService.currentUser._id).subscribe(async (res) => {
                    this.steps[0].isSelected = false;
                    this.steps[1].isSelected = false;
                    this.steps[2].isSelected = false;
                    this.steps[3].isSelected = true;
                    await loading.dismiss();
                    await this.presentToast(res.msg, 2000);
                });
            })

        }
        // Checkout steps
        // this.steps = [
        //     {
        //         step: 'Billing',
        //         isSelected: true
        //     },
        //     {
        //         step: 'Payment',
        //         isSelected: false
        //     },
        //     {
        //         step: 'Confirm',
        //         isSelected: false
        //     },
        //     {
        //         step: 'Result',
        //         isSelected: false
        //     }
        // ];
        this.utilisateur = await this.authService.currentUser;
        this.cards = new Map<string, string>();
        // this.cartItems = this.cmdService.commande.itemsCart;

        // Payment cards images

        for (const item in PaymentMethods) {
            this.cards.set(item, PaymentMethods[item]);
        }

        console.log(this.cards);
        // this.paymentAmount = '' + this.cmdService.commande.amount;
        // this.cards = ["assets/images/cards/visa.png",
        //   "assets/images/cards/mastercard.png",
        //   "assets/images/cards/paypal.png"]

        this.cardForm.get('cardNumber').setValue(4242424242424242);
        this.cardForm.get('cardName').setValue('test');
        this.cardForm.get('exp_month').setValue(12);
        this.cardForm.get('exp_year').setValue(2020);
        this.cardForm.get('cvv').setValue(220);
    }

    async ionViewWillEnter() {
        this.utilisateur = await this.authService.currentUser;
        this.cartItems = this.cmdService.commande.itemsCart;

        for (let element of this.cartItems) {
            if (element.item.availability.type === 'En Magasin') {
                element.item.availability.feed = 0;
            }
            // @ts-ignore
            this.total += element.item.availability.feed + element.amount;
        }
        ;
    }

    getRatedPrice(price: number, rate: number) {
        const retour = price * rate;
        return retour;
    }

    async payWithStripe() {
        this.stripe.setPublishableKey(this.stripe_key);

        const info = await Device.getInfo() as Device;
        console.log(info);
        // const addrDetails = {
        //     name: this.addrForm.value.name,
        //     line1: this.addrForm.value.addr_1,
        //     city: this.addrForm.value.city,
        //     country: this.addrForm.value.country,
        //     phone: this.addrForm.value.phone,
        //     state: this.addrForm.value.state,
        //     appNumber: this.addrForm.value.app,
        //     email: this.utilisateur.email,
        // };
        this.cmdService.commande.userInfo = {} as UserInfo;
        let address = {} as Address;
        let telephones = [] as Telephone[];
        this.cmdService.commande.userInfo = {} as UserInfo;
        this.cmdService.commande.userInfo.firstName = this.addrDetails.name;
        address.roadName = this.addrDetails.addr_1;
        address.appartNumber = this.addrDetails.app;
        address.town = this.addrDetails.city;
        address.region = this.addrDetails.state;
        address.country = this.addrDetails.country;
        address.postalCode = this.addrDetails.zipcode;
        this.cmdService.commande.userInfo.address = address;
        this.cmdService.commande.userInfo.devices = [info];
        telephones = this.addrDetails.phone ? [{
            numeroTelephone: this.addrDetails.phone,
            categorieTelephone: 'contact'
        }] : this.cmdService.commande.userInfo.telephones;
        this.cmdService.commande.userInfo.telephones = telephones;

        this.cardDetails = {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2020,
            cvc: '220'
        };

        const commande = {
            amount: this.amount,
            customer: this.utilisateur.customer_profile,
            commande: this.cmdService.commande
        };

        this.paymentService.checkout(this.cardDetails, this.addrDetails, commande).subscribe(async (res) => {
            console.log(res);
            this.cmdService.commande = res;
            if (res.result === 'Success') {
                await this.storage.removeItem('cart');
                this.cmdService.commande = res.commande;
                this.cmdService.commande.status = OrderStatus.PAID;
                this.cmdService.commande.amount = this.cartService.total;
                // this.cmdService.updateCommande().subscribe((res) => {
                //     this.cmdService.commande = {} as Commande;
                // });
                const grouped = this.cmdService.commande.itemsCart.reduce((r, a) => {
                    console.log('a', a);
                    console.log('r', r);
                    r[a.item.utilisateurId] = [...r[a.item.utilisateurId] || [], a];
                    return r;
                }, {});

                console.log(grouped);

                const array = Object.values(grouped).reverse();

                console.log(JSON.stringify(array));

                for (let cmd of array) {
                    let ids = [];
                    for (let c of cmd as itemCart[]) {
                        ids.push(c._id);
                    }
                    const msg = 'Vous avez une nouvelle commande de ' + this.utilisateur._id ? this.addrDetails.name : this.cmdService.commande.userInfo.firstName;
                    const notification: Notification = {
                        title: 'Nouvelle commande',
                        message: msg,
                        // message_id: msg._id,
                        utilisateurId: cmd[0].item.utilisateurId,
                        // avatar: this.utilisateur.avatar.path,
                        // article: cmd.item,
                        items: ids,
                        read: false,
                        type: NotificationType.RECEIVED_ORDER,
                        sender: this.utilisateur._id
                    };
                    this.msgService.addNotification(notification).subscribe(res => {
                        let not = res as Notification;
                        let res_str = JSON.stringify(not);
                        if (!this.websocketService.getWebSocket()) {
                            console.log('No WebSocket connected :(');
                            return;
                        }
                        this.websocketService.getWebSocket().send(res_str);
                    });
                }
                this.cmdService.updateCommande().subscribe((res) => {
                    console.log(res);
                    const command: Commande = res.article;
                    for (let item of command.itemsCart) {
                        item.item.quantity -= item.qty;
                        this.articleService.update(item.item).subscribe((res) => {
                            console.info(res);
                        });
                    }
                    this.cmdService.commande = {} as Commande;
                });
                this.cmdService.cartItemCount.next(0);
                this.steps[0].isSelected = false;
                this.steps[1].isSelected = false;
                this.steps[2].isSelected = false;
                this.steps[3].isSelected = true;
            }
        });

        // const result = this.stripe.createCardToken(this.cardDetails)
        //     .then(token => {
        //         console.log(token);
        //         this.makePayment(token.id);
        //     })
        //     .catch(error => console.error(error));

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

    async payWithPaypal() {
        let amount_infos = {
            amount: this.getRatedPrice(this.amount, this.cuService.rate),
            subTotal: this.getRatedPrice(this.cartService.total, this.cuService.rate),
            tax: this.getRatedPrice(this.cartService.taxAmount, this.cuService.rate),
            currency: this.authService.currency.currency
        }
        // const loading = await this.loadCtrl.create({
        //     message: 'Please wait...'
        // });
        // await loading.present();
        this.paymentService.payWitPaypal(this.addrDetails, this.cmdService.commande, amount_infos).subscribe(res => {
            console.log(res);
            this.inAppBrowser.create(res.url);
        });
        // console.log('Pay ????');
        // this.payPal.init({
        //     PayPalEnvironmentProduction: 'pk_test_h4xJdyRxCxwG8AxSIzzDYd4600RtNJA1ha',
        //     PayPalEnvironmentSandbox: 'AW_6b6jtwQ-erzTNpij929f3--m_jXImBcHdhYI_n_hom6Nv7EgIewumGIuua9W8x1TTqZQz_BLYWv2H'
        // }).then(() => {
        //     // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        //     this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        //         // Only needed if you get an "Internal Service Error" after PayPal login!
        //         //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        //     })).then(() => {
        //         let payment = new PayPalPayment(this.amount, this.currency, 'Description', 'sale');
        //         this.payPal.renderSinglePaymentUI(payment).then((res) => {
        //             console.log(res);
        //             // Successfully paid
        //
        //             // Example sandbox response
        //             //
        //             // {
        //             //   "client": {
        //             //     "environment": "sandbox",
        //             //     "product_name": "PayPal iOS SDK",
        //             //     "paypal_sdk_version": "2.16.0",
        //             //     "platform": "iOS"
        //             //   },
        //             //   "response_type": "payment",
        //             //   "response": {
        //             //     "id": "PAY-1AB23456CD789012EF34GHIJ",
        //             //     "state": "approved",
        //             //     "create_time": "2016-10-03T13:33:33Z",
        //             //     "intent": "sale"
        //             //   }
        //             // }
        //         }, () => {
        //             // Error or render dialog closed without being successful
        //         });
        //     }, () => {
        //         // Error in configuration
        //     });
        // }, () => {
        //     // Error in initialization, maybe PayPal isn't supported or something else
        // });
    }

    // Go to xext section function

    next() {
        // If current section is billing then next payment section will be visible
        if (this.steps[0].isSelected) {
            this.cardForm.get('cardNumber').setValue(4242424242424242);
            this.cardForm.get('cardName').setValue('test');
            this.cardForm.get('exp_month').setValue(12);
            this.cardForm.get('exp_year').setValue(2020);
            this.cardForm.get('cvv').setValue(220);
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = true;
            this.steps[2].isSelected = false;
        }
        // If current section is Billing then next section confirm will be visible
        else if (this.steps[1].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = true;
            this.steps[3].isSelected = false;
        }
    }

    back() {
        // If current section is billing then next payment section will be visible
        if (this.steps[0].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = true;
            this.steps[2].isSelected = false;
            this.steps[2].isSelected = false;
        }
        // If current section is Billing then next section confirm will be visible
        else if (this.steps[1].isSelected) {
            this.steps[0].isSelected = true;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = false;
            this.steps[3].isSelected = false;
        }
    }

    // Go to order page function
    createOrder() {
        console.log(this.choosenOption);
        console.log(this.cards.get(this.choosenOption));
        // this.addrDetails = {
        //     name: this.addrForm.value.name,
        //     line1: this.addrForm.value.addr_1,
        //     city: this.addrForm.value.city,
        //     country: this.addrForm.value.country,
        //     phone: this.addrForm.value.phone,
        //     state: this.addrForm.value.state,
        //     appNumber: this.addrForm.value.app,
        //     email: this.utilisateur.email,
        // };
        // if (this.cmdService.commande.orders && this.cmdService.commande.orders.length > 0) {
        //     this.paymentService.createOrder(this.cmdService.commande, this.addrDetails).subscribe((res) => {
        //         this.cmdService.commande = res;
        //         this.steps[0].isSelected = false;
        //         this.steps[1].isSelected = false;
        //         this.steps[2].isSelected = true;
        //         this.steps[3].isSelected = false;
        //     });
        // } else {
        this.steps[0].isSelected = false;
        this.steps[1].isSelected = false;
        this.steps[2].isSelected = true;
        this.steps[3].isSelected = false;
        // }
        // this.router.navigate(['/menu/tabs/orders']);
    }

    // Go to product page
    async gotoProductsPage() {
        // this.dismiss();
        await this.router.navigate(['/menu/tabs/products']);
        // await this.navCtrl.navigateRoot('/menu/tabs/products');
    }

    // Back to previous screen
    choosenOption: any;

    dismiss() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

    showPaymentOption(option) {
        this.choosenOption = option;
        switch (option) {
            case 'VISA':
                this.cardForm.get('cardNumber').setValue(4242424242424242);
                this.cardForm.get('cardName').setValue('test');
                this.cardForm.get('exp_month').setValue(12);
                this.cardForm.get('exp_year').setValue(2020);
                this.cardForm.get('cvv').setValue(220);
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

    use_information_toggle() {
        if (this.utilisateur._id) {
            if (this.user_informations) {
                this.addrForm.get('name').setValue(this.utilisateur.userInfo.firstName + ' ' + this.utilisateur.userInfo.lastName);
                this.addrForm.get('addr_1').setValue(this.utilisateur.userInfo.address.roadName);
                this.addrForm.get('app').setValue(this.utilisateur.userInfo.address.appartNumber);
                this.addrForm.get('city').setValue(this.utilisateur.userInfo.address.town);
                this.addrForm.get('phone').setValue(this.utilisateur.userInfo.telephones[0].numeroTelephone);
                this.addrForm.get('state').setValue(this.utilisateur.userInfo.address.region);
                this.addrForm.get('country').setValue(this.utilisateur.userInfo.address.country);
                this.addrForm.get('zipcode').setValue(this.utilisateur.userInfo.address.postalCode);
                this.cardForm.get('cardNumber').setValue(4242424242424242);
                this.cardForm.get('cardName').setValue('test');
                this.cardForm.get('exp_month').setValue(12);
                this.cardForm.get('exp_year').setValue(2020);
                this.cardForm.get('cvv').setValue(220);
            } else {
                this.addrForm.get('name').setValue('');
                this.addrForm.get('addr_1').setValue('');
                this.addrForm.get('app').setValue('');
                this.addrForm.get('city').setValue('');
                this.addrForm.get('phone').setValue('');
                this.addrForm.get('state').setValue('');
                this.addrForm.get('zipcode').setValue('');
            }
        } else {
            this.user_informations = this.user_informations;
            this.presentToast('No user logged in', 2000);
        }
    }

    goToInfo(option) {
        switch (option) {
            case 'address':
                this.steps[0].isSelected = true;
                this.steps[1].isSelected = false;
                this.steps[2].isSelected = false;
                this.steps[3].isSelected = false;
                break;
            case 'paiement':
                this.steps[0].isSelected = false;
                this.steps[1].isSelected = true;
                this.steps[2].isSelected = false;
                this.steps[3].isSelected = false;
                break;
        }
    }

    getLast4Digits(str: any) {
        const val = '' + str;
        return val.substr(val.length - 4);
    }

    getQuantities(article: Article) {
        let quantities = [];
        for (let i = 1; i <= article.quantity; i++) {
            quantities.push(i);
        }
        return quantities;
    }

    async removeProduct(item: itemCart, index) {
        this.cartService.removeProduct(item, index, this.utilisateur).then((res) => {
            this.presentToast(res, 2000);
        });
    }

    async updatePanier(item: itemCart) {
        item.amount = item.item.price * item.qty;
        this.cmdService.commande.itemsCart = this.cartService.cartItems;
        this.cartService.total = this.cartService.total + item.item.price;
        let totalAmount = 0;
        for (let c of this.cartService.cartItems) {
            totalAmount += c.amount;
        }
        this.cartService.taxAmount = this.cartService.total * 0.1;
        this.cmdService.commande.amount = totalAmount;
        this.cmdService.commande.quantity = this.cartItems.length;
        const loading = await this.loadCtrl.create({
            message: 'Please wait...'
        });
        await loading.present();
        this.cmdService.updateCommande().subscribe(async (res) => {
            this.cmdService.commande = res.article;
            await this.storage.setObject('cart', this.cmdService.commande);
            console.log('result', res.result);
            if (res.result === 'successfull') {
                await loading.dismiss();
            }
        });
    }

    async presentToast(message: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message,
            duration
        });
        await toast.present();
    }
}
