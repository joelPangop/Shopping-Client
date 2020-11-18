import {Component, OnInit} from '@angular/core';
import {NavController, Platform, PopoverController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {StorageService} from '../../services/storage.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Router} from '@angular/router';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {Currencies} from '../../models/Currencies';
import {BehaviorSubject} from 'rxjs';
import {PaymentService} from '../../services/payment.service';
import {BankViewPage} from '../bank-view/bank-view.page';

const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    selector: 'app-bank',
    templateUrl: './bank.page.html',
    styleUrls: ['./bank.page.scss'],
})
export class BankPage implements OnInit {

    bankForm: FormGroup;
    steps: any = [];
    validation_messages: any = {};
    bank_plan: any[];
    user_informations: boolean = false;
    user_addr_informations: boolean = false;
    utilisateur: Utilisateur;
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    birthday: any;
    msg_err: string = '';

    constructor(public authService: AuthService, public platform: Platform, public formBuilder: FormBuilder,
                private storage: StorageService, private navCtrl: NavController, private popoverController: PopoverController,
                private paymentService: PaymentService) {
        this.bankForm = this.formBuilder.group({
            email: [authService.currentUser.email, Validators.compose([
                Validators.pattern(PURE_EMAIL_REGEXP),
                Validators.required
            ])],
            full_name: ['', [Validators.required]],
            addr_1: ['', [Validators.required]],
            appNumber: [''],
            addr_2: [''],
            city: ['', [Validators.required]],
            phone: [''],
            state: ['', [Validators.required]],
            country: ['', [Validators.required]],
            zipcode: ['', [Validators.required]],
            currency: ['', [Validators.required]],
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
    }

    ngOnInit() {
        this.utilisateur = this.authService.currentUser;
        this.bank_plan = this.utilisateur.payment_account.external_accounts.data;
        this.steps = [
            {
                step: 'Status',
                isSelected: true
            },
            {
                step: 'Address',
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
        this.validation_messages = {
            full_name: [
                {type: 'required', message: 'Full name is required.'},
            ],
            email: [
                {type: 'required', message: 'Full name is required.'},
                {type: 'pattern', message: 'Email format not correct.'}
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
            routing_number: [
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
            ],
            zipcode: [
                {type: 'required', message: 'Postal code is required.'}
            ]
        };
    }

    birthdayValidator(formGroup: FormGroup): { [err: string]: any } {
        return new Date(formGroup.get('birthday').value) < new Date() ? null : {birthdayNotCorrect: true};
    }

    use_information_toggle() {
        console.log(this.user_informations);
        if (this.user_informations) {
            this.bankForm.get('account_holder_name').setValue(this.utilisateur.userInfo.lastName + ' ' + this.utilisateur.userInfo.firstName);
        } else {
            this.bankForm.get('account_holder_name').setValue('');
        }
    }

    use_information_addr_toggle() {
        console.log(this.user_informations);
        if (this.user_addr_informations) {
            this.bankForm.get('full_name').setValue(this.utilisateur.userInfo.lastName + ' ' + this.utilisateur.userInfo.firstName);
            this.bankForm.get('addr_1').setValue(this.utilisateur.userInfo.address.roadName);
            this.bankForm.get('appNumber').setValue(this.utilisateur.userInfo.address.appartNumber);
            this.bankForm.get('city').setValue(this.utilisateur.userInfo.address.town);
            this.bankForm.get('phone').setValue(this.utilisateur.userInfo.telephones[0].numeroTelephone);
            this.bankForm.get('state').setValue(this.utilisateur.userInfo.address.region);
            this.bankForm.get('zipcode').setValue(this.utilisateur.userInfo.address.postalCode);
            this.bankForm.get('country').setValue(this.utilisateur.userInfo.address.country);
        } else {
            this.bankForm.get('full_name').setValue('');
            this.bankForm.get('addr_1').setValue('');
            this.bankForm.get('appNumber').setValue('');
            this.bankForm.get('city').setValue('');
            this.bankForm.get('phone').setValue('');
            this.bankForm.get('state').setValue('');
            this.bankForm.get('zipcode').setValue('');
            this.bankForm.get('country').setValue('');
        }
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
                    this.bankForm.get('currency').setValue(data.data.currency);
                }
            });
        return await popover.present();
    }

    next() {
        if (this.steps[0].isSelected) {
            this.steps[1].isSelected = true;
            this.steps[0].isSelected = false;
            this.steps[2].isSelected = false;
        } else if (this.steps[1].isSelected) {
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = true;
        }
    }

    back() {
        if (this.steps[1].isSelected) {
            this.steps[2].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[0].isSelected = true;
        }
        if (this.steps[2].isSelected) {
            this.steps[2].isSelected = false;
            this.steps[1].isSelected = true;
            this.steps[0].isSelected = false;
        }
    }

    subscribe() {
        console.log('birthday', new Date(this.bankForm.get('birthday').value) > new Date());
        const user_info = {
            account_holder_name: this.bankForm.get('account_holder_name').value,
            account_holder_type: this.bankForm.get('account_holder_type').value,
            routing_number: this.bankForm.get('routing_number').value,
            account_number: this.bankForm.get('account_number').value,
            currency: this.bankForm.get('currency').value,
            country: this.bankForm.get('country').value,
        };

        this.paymentService.createBank(user_info, this.utilisateur, this.bankForm.get('email').value).subscribe(async (res) => {
            console.log('token', res);
            await this.storage.setObject('Utilisateur', res.user);
            this.authService.currentUser = res.user;
            this.bank_plan = res.bankAccount;
            this.steps[0].isSelected = false;
            this.steps[1].isSelected = false;
            this.steps[2].isSelected = false;
            this.steps[3].isSelected = true;
        }, err =>{
            console.log(err);
            this.msg_err = err.error.message;
        });
    }

    removeBank(bank: any, i: number) {
        this.paymentService.deleteBank(bank.id, this.utilisateur).subscribe(async (res) => {
            await this.storage.setObject('Utilisateur', res.user);
            this.authService.currentUser = res.user;
            this.bank_plan = res.bankAccount;
        });
    }

    gotoStatus() {
        this.steps[0].isSelected = true;
        this.steps[1].isSelected = false;
        this.steps[2].isSelected = false;
        this.steps[3].isSelected = false;
    }

    close_msg() {
        this.msg_err = '';
    }

    async viewBank(ev, bank: any) {
        const popover = await this.popoverController.create({
            component: BankViewPage,
            event: ev,
            translucent: true,
            cssClass: 'popover-bank',
            componentProps: {
                bank,
            }
        });
        return await popover.present();
    }
}
