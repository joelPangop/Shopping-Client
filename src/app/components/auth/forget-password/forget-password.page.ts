import {Component, OnInit} from '@angular/core';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {SMS} from '@ionic-native/sms/ngx';
import {MessageService} from '../../../services/message.service';
import {Mail} from '../../../models/mail-interface';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../Utils';
import {AuthService} from '../../../services/auth.service';
import {ToastController} from '@ionic/angular';
import {Utilisateur} from '../../../models/utilisateur-interface';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.page.html',
    styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

    subject = 'reset password';
    body = 'nouveau mot de passe';
    to = '';
    userForm: FormGroup;

    constructor(private emailComposer: EmailComposer, private sms: SMS, private messageService: MessageService,
                public formBuilder: FormBuilder, private authService: AuthService, private toastCtrl: ToastController) {
        this.userForm = this.formBuilder.group({
            email: ['']
        });
    }

    ngOnInit() {
    }

    send() {
        const pwd = Utils.makeString(10);
        this.body = 'The user\'s new password: '+ pwd +'\n Reset password';
        const content: Mail = {
            to: this.userForm.value.email,
            subject: this.subject,
            text: this.body,
        };

        this.authService.getUserByEmail(content.to).subscribe((resp: any)=>{
            const user = resp.user as Utilisateur;
            if (user){
                this.messageService.sendMail(content).subscribe(res => {
                    console.log(res);
                    user.password = pwd;
                    this.authService.updateProfilePassword(user).subscribe((editUser)=>{
                        console.log(editUser);
                    });
                });
            } else {
                this.presentToast('The user has not been found', 2500);
            }
        })
    }

    sendSMS() {
        const success = (hasPermission) => {
            if (hasPermission) {
                this.sms.send('+15147929006', 'Hello world!');
            } else {
                // show a helpful message to explain why you need to require the permission to send a SMS
                // read http://developer.android.com/training/permissions/requesting.html#explain for more best practices
            }
        };
        const error = function(e) {
            alert('Something went wrong:' + e);
        };
        this.sms.hasPermission().then(r => {
            success;
        });
    }

    async presentToast(message: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message,
            duration
        });
        await toast.present();
    }

}
