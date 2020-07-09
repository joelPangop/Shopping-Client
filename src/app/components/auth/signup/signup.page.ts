import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
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
import {Utilisateur} from '../../../models/utilisateur-interface';
import {UserStorageUtils} from '../../../services/UserStorageUtils';

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

    constructor(private nativeStorage: NativeStorage, public formBuilder: FormBuilder, private articleService: ArticleService,
                public authSrv: AuthService, private imgSrv: ImageService, private toastCtrl: ToastController,
                private loadingCtrl: LoadingController, private navCtrl: NavController, public localStorage: Storage,
                private platform: Platform, private popoverController: PopoverController, private router: Router,
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
        this.userStorageUtils.getUser().then(res => {
            this.utilisateur = res as Utilisateur;
        });
        this.options = Object.keys(CategorieTelephone);
        this.authSrv.userInfo = {} as UserInfo;
        this.authSrv.userInfo.telephones = [] as Telephone[];
        this.authSrv.address = {} as Address;
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.genders = ['M.', 'F.', 'Other']
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

          // this.navCtrl.navigateRoot('intro')
          const navigationExtras: NavigationExtras = {
            queryParams: {
              special: JSON.stringify(res1)
            }
          };
          await this.router.navigate(['signin'], navigationExtras);
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
}
