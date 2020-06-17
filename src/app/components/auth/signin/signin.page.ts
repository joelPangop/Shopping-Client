import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {NavController} from '@ionic/angular';
import {Utilisateur} from '../../../models/utilisateur-interface';
import {environment} from '../../../models/environements';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  credentialsForm: FormGroup;
  utilisateur = {} as Utilisateur;

  constructor(private formBuilder: FormBuilder, private fb: Facebook, private http: HttpClient, private router: Router,
              private authService: AuthService, private storage: NativeStorage, private navCtrl: NavController,
              private activatedRoute: ActivatedRoute) {
    this.credentialsForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6),
        Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.utilisateur = JSON.parse(params.special);
      }
    });
    this.credentialsForm.value.password = !this.utilisateur.password ? '' : this.utilisateur.password;
    this.credentialsForm.value.email = !this.utilisateur.email ? '' : this.utilisateur.email;
  }
  loginWithFacebook(): void {

    // @ts-ignore
    this.fb.getLoginStatus((response: any) =>{
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

  }

  async login(event) {
    if (event.keyCode) {
      // tslint:disable-next-line:triple-equals
      if (event.keyCode == 13 && this.credentialsForm.valid) {
        await this.authService.login(this.credentialsForm.value).subscribe(res => {
          if (res) {
            this.navCtrl.navigateForward('/menu/tabs/tab1');
          }
        });
      }
    } else {
      await this.authService.login(this.credentialsForm.value).subscribe(res => {
      });
    }
  }

  async register() {
    await this.navCtrl.navigateRoot('/menu/tabs/register');
  }
}
