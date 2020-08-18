import {Component, OnInit, ViewChild} from '@angular/core';
import {Utilisateur} from '../../models/utilisateur-interface';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Telephone} from '../../models/telephone-interface';
import {UserInfo} from '../../models/userInfo-interface';
import {CategorieTelephone} from '../../models/CategorieTelephone';
import {AuthService} from '../../services/auth.service';
import {ImageService} from '../../services/image.service';
import {Article} from '../../models/article-interface';
import {ArticleService} from '../../services/article.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoadingController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {Currencies} from '../../models/Currencies';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../../services/storage.service';
import {EditProductPage} from '../edit-product/edit-product.page';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    profileType = 'Profile';
    utilisateur = {} as Utilisateur;
    userInfo = {} as UserInfo;
    telephones = [] as Telephone[];
    userForm: FormGroup;
    options: string[];
    imgURL: any;
    newImg: any;
    ischanged: boolean;
    // tslint:disable-next-line:variable-name
    error_messages = {};
    passwordType = 'password';
    passwordShown: boolean;
    private message: string;
    uploadForm: FormGroup;
    articles: Article[];
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    icon;
    currency;
    option: string;

    constructor(public formBuilder: FormBuilder, private articleService: ArticleService, private storage: StorageService,
                public authSrv: AuthService, private imgSrv: ImageService, private toastCtrl: ToastController, private router: Router,
                private loadingCtrl: LoadingController, private navCtrl: NavController, private userStorageUtils: UserStorageUtils,
                private popoverController: PopoverController, private activatedRoute: ActivatedRoute) {
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

    async ngOnInit() {
        this.option = this.activatedRoute.snapshot.paramMap.get('option');
        if (this.option) {
            this.profileType = this.option;
        }
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.options = Object.keys(CategorieTelephone);
        this.utilisateur = await this.userStorageUtils.getUser();
        console.log(this.utilisateur);
        this.authSrv.userInfo = this.utilisateur.userInfo;
        this.authSrv.address = this.utilisateur.userInfo.address;
        if (this.utilisateur.currency) {
            this.icon = this.utilisateur.currency.icon;
            this.currency = this.utilisateur.currency.currency;
        } else {
            this.icon = 'assets/' + Currencies['CAD'] + '.svg';
            this.currency = Currencies.CAD;
        }

        this.ischanged = false;
        this.passwordShown = false;
        this.imgURL = !this.utilisateur.avatar ? 'assets/profile_img.svg' : 'https://egoalservice.azurewebsites.net/image/' + this.utilisateur.avatar;
        this.loadData();
    }

    segmentChanged(event: CustomEvent) {
        console.log('event', event);
        this.profileType = event.detail.value;
    }

    passwordConfirm: any;

    // @ts-ignore
    loadData(): Observable<Article[]> {
        this.articleService.loadArticleByUser(this.utilisateur._id).subscribe(res => {
            this.articles = res as Article[];
            console.log(this.articles);
        });
    }

    public togglePassword() {
        if (this.passwordShown) {
            this.passwordShown = false;
            this.passwordType = 'password';
        } else {
            this.passwordShown = true;
            this.passwordType = 'text';
        }
    }

    password(formGroup: FormGroup): { [err: string]: any } {
        console.log('password', formGroup.get('password').value);
        console.log('confirm password', formGroup.get('passwordConfirm').value);
        return formGroup.get('password').value === formGroup.get('passwordConfirm').value ? null : {passwordMismatch: true};
    }

    async updateProfile() {
        console.log('update');
        this.utilisateur.userInfo = this.authSrv.userInfo;
        this.utilisateur.userInfo.address = this.authSrv.userInfo.address;
        this.utilisateur.userInfo = this.authSrv.userInfo;
        this.utilisateur.userInfo.address = this.authSrv.userInfo.address;
        this.utilisateur.password = this.userForm.value.password;

        if (this.newImg) {
            this.uploadForm.get('image').setValue(this.newImg);
            await this.imgSrv.uploadImage(this.uploadForm).subscribe(async res => {
                this.utilisateur.avatar = res.filename;
                await this.authSrv.updateProfile(this.utilisateur).subscribe(async res1 => {
                    const rep = res1 as object;
                    // @ts-ignore
                    this.user = rep.user as Utilisateur;
                    await this.authSrv.localStorage.set('Utilisateur', this.utilisateur).then(async data => {
                        this.authSrv.userInfo = this.utilisateur.userInfo;
                        this.authSrv.address = this.utilisateur.userInfo.address;
                        await this.authSrv.localStorage.set('IsLogginIn', true);
                    });
                    await this.authSrv.localStorage.set('Utilisateur', this.utilisateur).then(async data => {
                        this.authSrv.userInfo = this.utilisateur.userInfo;
                        this.authSrv.address = this.utilisateur.userInfo.address;
                        await this.authSrv.localStorage.set('IsLogginIn', true);
                    });
                });
            });
        } else {
            this.authSrv.updateProfile(this.utilisateur).subscribe(async res => {
                const rep = res as object;
                // @ts-ignore
                this.user = rep.user as Utilisateur;
                await this.authSrv.localStorage.set('Utilisateur', this.utilisateur).then(async data => {
                    this.authSrv.userInfo = this.utilisateur.userInfo;
                    this.authSrv.address = this.utilisateur.userInfo.address;
                    await this.authSrv.localStorage.set('IsLogginIn', true);
                });
                await this.authSrv.localStorage.set('Utilisateur', this.utilisateur).then(async data => {
                    this.authSrv.userInfo = this.utilisateur.userInfo;
                    this.authSrv.address = this.utilisateur.userInfo.address;
                    await this.authSrv.localStorage.set('IsLogginIn', true);
                });
            });
        }
    }

    addTelephone() {
        this.utilisateur.userInfo.telephones = this.authSrv.userInfo.telephones;
        if (this.authSrv.userInfo.telephones.length > 0) {
            if (this.authSrv.userInfo.telephones[this.authSrv.userInfo.telephones.length - 1].numeroTelephone !== '') {
                this.authSrv.userInfo.telephones.push({} as Telephone);
            }
        } else {
            this.authSrv.userInfo.telephones = [];
            this.authSrv.userInfo.telephones.push({} as Telephone);
        }
    }

    removeControl(index) {
        this.authSrv.userInfo.telephones.splice(index, 1);
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
    @ViewChild( 'content' ) content;
    async updateArticle(article: Article, index) {
        // await this.storage.setItem('page', 'profile');
        await this.navCtrl.navigateRoot('/menu/tabs/edit-product/' + article._id);

    }

    async deleteArticle(article: Article, index: number) {
        const loading = await this.loadingCtrl.create({
            message: 'Supression en cours'
        });
        await loading.present();
        this.articles.splice(index, 1);
        if (article.pictures) {
            for (const pic of article.pictures) {
                await this.imgSrv.deleteImage(pic).subscribe(res => {
                    console.log(res);
                });
            }
        }

        this.articleService.deleteArticle(article._id).subscribe(res => {
            // @ts-ignore
            this.presentToast(res);
            loading.dismiss();
            this.presentToast(res as string, 2000);
        }, error => {
            this.presentToast('Echec de suppression', 2000);
            loading.dismiss();
        });
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }

    doRefresh($event) {
        this.loadData();
        $event.target.complete();
        //     .subscribe((articles: Article[]) => {
        //     this.articles = articles;
        //     console.log('Articles a partir du panier', articles);
        //     $event.target.complete();
        // });
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
                currency: this.utilisateur.currency ? this.utilisateur.currency.currency : 'CAD',
                currencyIcon: this.utilisateur.currency ? this.utilisateur.currency.icon : 'assets/' + Currencies.CAD + '.svg',
                option: 'userCurrency'
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                this.currency = data.data.currency;
                this.icon = data.data.icon;
                this.utilisateur.currency.icon = this.icon;
                this.utilisateur.currency.currency = this.currency;
            });
        return await popover.present();
    }
}
