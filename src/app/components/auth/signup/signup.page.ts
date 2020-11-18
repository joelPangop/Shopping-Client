import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ArticleService} from '../../../services/article.service';
import {AuthService} from '../../../services/auth.service';
import {ImageService} from '../../../services/image.service';
import {LoadingController, ModalController, NavController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {NavigationExtras, Router} from '@angular/router';
import {Telephone} from '../../../models/telephone-interface';
import {CategorieTelephone} from '../../../models/CategorieTelephone';
import {UserInfo} from '../../../models/userInfo-interface';
import {Address} from '../../../models/address-interface';
import {Currency, Utilisateur} from '../../../models/utilisateur-interface';
import {UserStorageUtils} from '../../../services/UserStorageUtils';
import {ShowOptionsPage} from '../../show-options/show-options.page';
import {BehaviorSubject} from 'rxjs';
import {Currencies} from '../../../models/Currencies';
import {FileInfo, File} from '../../../models/file-interface';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    imgURL: any;
    passwordType = 'password';
    passwordConfirm: any;
    uploadForm: FormGroup;
    userForm: FormGroup;
    private message: string;
    private newImg: any;
    options: any;
    utilisateur = {} as Utilisateur;
    genders: string[] = ['M.', 'F.', 'Other'];
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    currencies: Map<string, string>;
    uploadedFile = {} as File;

    constructor(public formBuilder: FormBuilder, private articleService: ArticleService,
                public authSrv: AuthService, public imgSrv: ImageService, private toastCtrl: ToastController,
                private loadingCtrl: LoadingController, private navCtrl: NavController, public localStorage: Storage,
                public platform: Platform, private popoverController: PopoverController, private router: Router,
                private userStorageUtils: UserStorageUtils) {
        this.userForm = this.formBuilder.group({
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
        // this.userStorageUtils.getUser().then(res => {
        //     this.utilisateur = res as Utilisateur;
        // });
        this.options = Object.keys(CategorieTelephone);
        this.authSrv.userInfo = {} as UserInfo;
        this.authSrv.userInfo.telephones = [] as Telephone[];
        this.authSrv.address = {} as Address;
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.genders = ['M.', 'F.', 'Other'];
        this.utilisateur.currency = {
            currency: 'CAD',
            icon: 'flag-for-flag-canada'
        } as Currency;
        this.currencies = new Map<string, string>();
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
            this.uploadedFile.path = res.filename;
            this.utilisateur.avatar = this.uploadedFile;
            await this.authSrv.register(this.utilisateur).subscribe(async res1 => {
                const rep = res1 as object;

                // this.navCtrl.navigateRoot('intro')
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        special: this.authSrv.confirmation_code,
                        user: JSON.stringify(res1)
                    }
                };
                await this.router.navigate(['verification',], navigationExtras);
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
            // console.log(this.uploadedFile.fileInfo);
            this.uploadedFile.fileInfo = new FileInfo();
            this.uploadedFile.fileInfo.name = this.newImg.name;
            this.uploadedFile.fileInfo.size = this.newImg.size;
            this.uploadedFile.fileInfo.file_type = this.newImg.type;
            this.uploadedFile.fileInfo.ownerId = this.utilisateur._id;
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
        this.authSrv.userInfo.telephones.splice(i, 1);
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
