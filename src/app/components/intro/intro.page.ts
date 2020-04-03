import {Component, OnInit} from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {environment} from '../../models/environements';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.page.html',
    styleUrls: ['./intro.page.scss'],
})

export class IntroPage implements OnInit {

    credentialsForm: FormGroup;
    utilisateur = {} as Utilisateur;

    constructor(private formBuilder: FormBuilder, private fb: Facebook, private http: HttpClient, private router: Router,
                private authService: AuthService, private storage: NativeStorage, private navCtrl: NavController) {
    }

    ngOnInit() {
        this.credentialsForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.minLength(6)]],
            password: ['', [Validators.required, Validators.minLength(6),
                Validators.maxLength(30)]]
        });
    }

    loginWithFacebook(): void {
        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then((res: FacebookLoginResponse) => {
                console.log('Logged into Facebook!', res);
                this.fb.api('me?fields=email', []).then(async profil => {
                    const email: string = profil.email;
                    this.utilisateur = {
                        userInfo: undefined,
                        contact: email,
                        type: 'email',
                        avatar: '',
                        username: ''
                    };
                    await this.storage.setItem('Utilisateur', this.utilisateur);
                    await this.storage.setItem('isLoggedIn', true);
                    const url = `${environment.api_url}/utilisateur`;
                    this.http.post(url, this.utilisateur)
                        .subscribe(user => {
                            console.log('user', user);
                            this.navCtrl.navigateForward('/menu');
                        });
                });
            }).catch(e => console.log('Error logging into Facebook', e));
    }

    loginWithPhone(): void {

    }

    async login(event) {
        if (event.keyCode) {
            // tslint:disable-next-line:triple-equals
            if (event.keyCode == 13 && this.credentialsForm.valid) {
                await this.authService.login(this.credentialsForm.value).subscribe(res => {
                    if(res){
                        this.navCtrl.navigateForward("/menu");

                    }
                    // if (res) {
                    // this.authService.isAdmin();
                    // this.navCtrl.navigateForward('/home');
                    // }
                });
                //     .subscribe(success => {
                //     if (success) {
                //         // this.authService.isAdmin();
                //         console.log(success);
                //         // this.authService.authenticationState.next(true);
                //         // this.navCtrl.navigateRoot("/");
                //     }
                // });
            }
        } else {
            await this.authService.login(this.credentialsForm.value).subscribe(res => {
                // if(res){
                    // this.router.navigateByUrl("menu/product-list");
                // }
                // if (res) {
                // this.navCtrl.navigateForward('/home');
                // }
                // this.router.navigate(['menu/home']);
                // this.storage.setItem('page', 'menu/home');
                // this.authService.isAdmin();
            });
            //     .subscribe(success => {
            //     if (success) {
            //         // this.authService.isAdmin();
            //         console.log(success);
            //         // this.navCtrl.navigateRoot("/");
            //     }
            // });
        }
    }

    async register() {
        await this.navCtrl.navigateRoot('/register');
    }
}
