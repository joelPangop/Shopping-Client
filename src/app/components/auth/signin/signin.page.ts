import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {LoadingController, NavController, Platform} from '@ionic/angular';
import {Utilisateur} from '../../../models/utilisateur-interface';
import {environment} from '../../../models/environements';
import {UserStorageUtils} from '../../../services/UserStorageUtils';
import {Plugins} from '@capacitor/core';
import {PagesService} from '../../../services/pages.service';
import {MessageService} from '../../../services/message.service';
import {CommandeService} from '../../../services/commande.service';
import {CartService} from '../../../services/cart.service';
import {StorageService} from '../../../services/storage.service';
import {catchError} from 'rxjs/operators';

const {CapacitorVideoPlayer, Device} = Plugins;

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

    credentialsForm: FormGroup;
    utilisateur = {} as Utilisateur;
    info: any;
    viewPwd: boolean = false;

    constructor(private formBuilder: FormBuilder, private fb: Facebook, private http: HttpClient, private router: Router,
                private authService: AuthService, private navCtrl: NavController, public platform: Platform,
                private activatedRoute: ActivatedRoute, private userStorageUtils: UserStorageUtils,
                private loadingCtrl: LoadingController, private cmdService: CommandeService, public cartService: CartService,
                private storage: StorageService) {

        this.credentialsForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6),
                Validators.maxLength(30)]],
            email: ['', [Validators.required, Validators.minLength(6), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
        });
    }

    async ngOnInit() {
        // this.userStorageUtils.getUser().then(res => {
        //         //     this.utilisateur = res as Utilisateur;
        //         // });

        let email: string = "";
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params.special) {
                email = params.special;
            }
        });
        this.info = await Device.getInfo();
        this.credentialsForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6),
                Validators.maxLength(30)]],
            email: [email , [Validators.required, Validators.minLength(6)]]
        });
        // this.credentialsForm.value.password = !this.utilisateur.password ? '' : this.utilisateur.password;
        // this.credentialsForm.value.email = !this.utilisateur.email ? '' : this.utilisateur.email;
    }

    loginWithFacebook(): void {

        // @ts-ignore
        this.fb.getLoginStatus((response: any) => {
            console.log(response);
        });

        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => {
                console.log('Logged into Facebook!', res);

                // this.fb.api('me?fields=email', []).then(async profil => {
                //   const email: string = profil.email;
                //   this.utilisateur = {
                //     userInfo: undefined,
                //     contact: email,
                //     type: 'email',
                //     avatar: '',
                //     username: '',
                //   };
                //   await this.storage.setItem('Utilisateur', this.utilisateur);
                //   await this.storage.setItem('isLoggedIn', true);
                //   const url = `${environment.api_url}/utilisateur`;
                //   this.http.post(url, this.utilisateur)
                //       .subscribe(user => {
                //         console.log('user', user);
                //         this.navCtrl.navigateForward('/menu');
                //       });
                // });
            }).catch(e => console.log('Error logging into Facebook', e));
    }

    loginWithPhone(): void {
        console.log('btn clicked');
        (<any>window).AccountKitPlugin.loginWithPhoneNumber(
            {
                useAccessToken: true,
                defaultCountryCode: "US",
                facebookNotificationsEnabled: true
            }, (success) => {
                console.log('success', success);
                (<any>window).AccountKitPlugin.getAccount(
                    async account => {
                        console.log('account', account);
                        // on crée l'objet 'utilisateur'
                        this.utilisateur = {
                            contact : account.phoneNumber,
                            type: 'phone',
                            avatar: "",
                            username: ""
                        }
                        await this.storage.setObject('isLoggedIn', true);
                        // stocker utilisateur dans MongoDB
                        let url : string = `${environment.api_url}/Utilisateurs`;
                        this.http.post(url, this.utilisateur)
                            .subscribe(async user => {
                                await this.storage.setObject('Utilisateur', user);
                                // naviguer vers la page d'acceuil
                                console.log('user', user);
                                this.navCtrl.navigateRoot('/home');
                            })
                    }, (fail => {
                        console.log('fail', fail)
                    }))
            }, (error => {
                console.log('error', error);
            }))
    }

    async login(event) {
        const loading = await this.loadingCtrl.create({
            message: 'Chargement...'
        });
        await loading.present();
        if (event.keyCode) {
            // tslint:disable-next-line:triple-equals
            if (event.keyCode == 13 && this.credentialsForm.valid) {
                await this.authService.login(this.credentialsForm.value).subscribe(res => {
                    if (res) {
                        let deviceIDs = [];
                        this.authService.currentUser.userInfo.devices.forEach(div => {
                            deviceIDs.push(div.uuid);
                        });
                        if (deviceIDs.includes(this.info.uuid)) {
                            this.navCtrl.navigateForward('/menu/tabs/tab1');
                        } else {
                            this.authService.currentUser.userInfo.devices.push(this.info);
                            this.authService.updateProfile(this.authService.currentUser).subscribe((res) => {
                                this.navCtrl.navigateForward('/menu/tabs/tab1');
                            });
                        }
                    }
                });
            }
        } else {
            await this.authService.login(this.credentialsForm.value).subscribe(res => {
                if (res.user) {
                    this.authService.currentUser = res.user;
                    let deviceIDs = [];
                    if (res.user.userInfo.devices) {
                        res.user.userInfo.devices.forEach(div => {
                            deviceIDs.push(div.uuid);
                        });
                    }
                    if (deviceIDs.includes(this.info.uuid)) {
                        // this.cmdService.loadCommande(res.user[0]).subscribe((res) => {
                        //     {
                        //         let data = res;
                        //         this.cartService.setCartItemCount(data ? data.itemsCart.length : 0);
                        //     }
                        // });
                        this.navCtrl.navigateForward('/menu/tabs/tab1');
                    } else {
                        res.user.userInfo.devices.push(this.info);
                        this.authService.updateProfile(res.user).subscribe((res) => {
                            // this.cmdService.loadCommande(res.user[0]).subscribe((res) => {
                            //     {
                            //         let data = res;
                            //         this.cartService.setCartItemCount(data ? data.itemsCart.length : 0);
                            //     }
                            // });
                            this.navCtrl.navigateForward('/menu/tabs/tab1');
                        });
                    }

                    loading.dismiss();
                }
            });
        }
    }

    async register() {
        await this.navCtrl.navigateRoot('/menu/tabs/register');
    }
}
