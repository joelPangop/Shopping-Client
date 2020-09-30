import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateur-interface';

@Component({
    selector: 'app-verification',
    templateUrl: './verification.page.html',
    styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
    userForm: FormGroup;
    verification_code: string;
    user: Utilisateur;

    constructor(private activatedRoute: ActivatedRoute, public formBuilder: FormBuilder, private router: Router,
                private authSrv: AuthService) {
        this.userForm = this.formBuilder.group({
            word1: [''],
            word2: [''],
            word3: [''],
            word4: [''],
            word5: ['']
        });
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params && params.special) {
                this.verification_code = params.special;
                this.user = JSON.parse(params.user);
            }
        });
    }

    async send() {
      const verification = this.userForm.value.word1 + this.userForm.value.word2 + this.userForm.value.word3 + this.userForm.value.word4 + this.userForm.value.word5;
      if (this.verification_code === verification) {
        this.user.verified = true;
        this.authSrv.verification_user(this.user).subscribe(async (res) =>{
          const navigationExtras: NavigationExtras = {
            queryParams: {
              special: this.user.email
            }
          };
          await this.router.navigate(['signin'], navigationExtras);
        })
      }
    }
}
