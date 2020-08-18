import {Component, OnInit} from '@angular/core';
import {Currency, Utilisateur} from '../../models/utilisateur-interface';
import {UserInfo} from '../../models/userInfo-interface';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ArticleService} from '../../services/article.service';
import {AuthService} from '../../services/auth.service';
import {ImageService} from '../../services/image.service';
import {LoadingController, NavController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {CategorieTelephone} from '../../models/CategorieTelephone';
import {Telephone} from '../../models/telephone-interface';
import {Address} from '../../models/address-interface';
import {Storage} from '@ionic/storage';
import {Currencies} from '../../models/Currencies';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {BehaviorSubject} from 'rxjs';
import {NavigationExtras, Router} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    uploadForm: FormGroup;
    imgURL: any;
    utilisateur = {} as Utilisateur;
    userInfo = {} as UserInfo;
    options: any;
    userForm: FormGroup;
    passwordType = 'password';
    ischanged: boolean;
    passwordShown: boolean;
    private message: string;
    newImg: any;
    passwordConfirm: any;
    newPassword: any;
    currencies: Map<string, string>;
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();

    constructor(public formBuilder: FormBuilder, private articleService: ArticleService,
                public authSrv: AuthService, private imgSrv: ImageService, private toastCtrl: ToastController,
                private loadingCtrl: LoadingController, private navCtrl: NavController, public localStorage: Storage,
                private platform: Platform, private popoverController: PopoverController, private router: Router) {
        this.userForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
            password: ['', [Validators.required, Validators.minLength(6),
                Validators.maxLength(30)]],
            passwordConfirm: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(30),
            ])
        }, {validator: this.password});
    }

    ngOnInit() {
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.utilisateur.currency = {
            currency: 'CAD',
            icon: 'flag-for-flag-canada'
        } as Currency;
        this.currencies = new Map<string, string>();
        this.options = Object.keys(CategorieTelephone);
        this.authSrv.userInfo = {} as UserInfo;
        this.authSrv.userInfo.telephones = [] as Telephone[];
        this.authSrv.address = {} as Address;
        this.ischanged = false;
        this.passwordShown = false;
        for (const item in Currencies) {
            console.log('item:', item);
            console.log('item value:', Currencies[item]);
            this.currencies.set(item, Currencies[item]);
        }
    }

    async createProfile() {
        this.utilisateur.userInfo = this.authSrv.userInfo;
        this.utilisateur.userInfo.address = this.authSrv.address;
        this.utilisateur.userInfo.telephones = this.authSrv.userInfo.telephones;
        this.utilisateur.password = this.userForm.value.password;
        this.uploadForm.get('image').setValue(this.newImg);
        await this.imgSrv.uploadImage(this.uploadForm).subscribe(async res => {
            this.utilisateur.avatar = res.filename;
            await this.authSrv.register(this.utilisateur).subscribe(async res1 => {
                const rep = res1 as object;
                // @ts-ignore
                this.user = rep.user as Utilisateur;
                if (this.platform.is('ios') || this.platform.is('android')) {
                    await this.authSrv.localStorage.set('Utilisateur', this.utilisateur).then(async data => {
                        this.authSrv.userInfo = this.utilisateur.userInfo;
                        this.authSrv.address = this.utilisateur.userInfo.address;
                        await this.authSrv.localStorage.set('IsLogginIn', true);
                    });
                } else {
                    await this.localStorage.set('Utilisateur', this.utilisateur);
                    await this.localStorage.set('IsLogginIn', true);
                }

                // this.navCtrl.navigateRoot('intro')
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        special: JSON.stringify(res1)
                    }
                };
                await this.router.navigate(['intro'], navigationExtras);
            });
        });
    }

    password(formGroup: FormGroup): { [err: string]: any } {
        console.log('password', formGroup.get('password').value);
        console.log('confirm password', formGroup.get('passwordConfirm').value);
        return formGroup.get('password').value === formGroup.get('passwordConfirm').value ? null : {passwordMismatch: true};
    }

    onFileSelect(event) {
        this.imgURL = [];
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.newImg = event.target.files[0];
            this.preview(file);
        }
    }

    preview(files) {
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
            this.imgURL = reader.result;
        };
    }

    removeControl(i: number) {

    }

    addTelephone() {
        if (this.authSrv.userInfo.telephones.length > 0) {
            if (this.authSrv.userInfo.telephones[this.authSrv.userInfo.telephones.length - 1].numeroTelephone !== '') {
                this.authSrv.userInfo.telephones.push({} as Telephone);
            }
        } else {
            this.authSrv.userInfo.telephones = [];
            this.authSrv.userInfo.telephones.push({} as Telephone);
        }
    }

    togglePassword() {
        if (this.passwordShown) {
            this.passwordShown = false;
            this.passwordType = 'password';
        } else {
            this.passwordShown = true;
            this.passwordType = 'text';
        }
    }

    public async setCurrency(ev) {
        // @ts-ignore
        const popover = await this.popoverController.create({
            component: ShowOptionsPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                currOptionSubject: this.currOptionSubject,
                currIconOptionSubject: this.currIconOptionSubject,
                currency: this.utilisateur.currency.currency,
                currencyIcon: this.utilisateur.currency.icon,
                option: 'userCurrency'
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                this.utilisateur.currency.currency = data.data.currency;
                this.utilisateur.currency.icon = data.data.icon;
            });
        return await popover.present();
    }
}
