import {Component, OnInit} from '@angular/core';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserInfo} from '../../models/userInfo-interface';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ArticleService} from '../../services/article.service';
import {AuthService} from '../../services/auth.service';
import {ImageService} from '../../services/image.service';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {CategorieTelephone} from '../../models/CategorieTelephone';
import {Telephone} from '../../models/telephone-interface';
import {Address} from '../../models/address-interface';

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

    constructor(private nativeStorage: NativeStorage, public formBuilder: FormBuilder, private articleService: ArticleService,
                public authSrv: AuthService, private imgSrv: ImageService, private toastCtrl: ToastController,
                private loadingCtrl: LoadingController, private navCtrl: NavController) {
        this.userForm = this.formBuilder.group({
            passwordToValidate: ['', [Validators.required, Validators.minLength(6),
                Validators.maxLength(30)]],
            telephone: ['', Validators.required],
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
        this.options = Object.keys(CategorieTelephone);
        this.authSrv.userInfo = {} as UserInfo;
        this.authSrv.userInfo.telephones = [] as Telephone[];
        this.authSrv.address = {} as Address;
        this.ischanged = false;
        this.passwordShown = false;
    }

    async createProfile() {
        this.utilisateur.userInfo = this.authSrv.userInfo;
        this.utilisateur.userInfo.address = this.authSrv.address;
        this.utilisateur.userInfo.telephones = this.authSrv.userInfo.telephones;
        this.utilisateur.password = this.userForm.get('passwordToValidate').value;
        this.uploadForm.get('image').setValue(this.newImg);
        await this.imgSrv.uploadImage(this.uploadForm).subscribe(async res => {
            this.utilisateur.avatar = res.filename;
            await this.authSrv.register(this.utilisateur).subscribe(async res1 => {
                const rep = res1 as object;
                // @ts-ignore
                this.user = rep.user as Utilisateur;
                await this.authSrv.storage.setItem('Utilisateur', this.utilisateur).then(async data => {
                    this.authSrv.userInfo = this.utilisateur.userInfo;
                    this.authSrv.address = this.utilisateur.userInfo.address;
                    await this.authSrv.storage.setItem('IsLogginIn', true);
                });
            });
        });
    }

    password(formGroup: FormGroup): { [err: string]: any } {
        return formGroup.get('passwordToValidate').value === formGroup.get('passwordConfirm').value ? null : {passwordMismatch: true};
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
}
