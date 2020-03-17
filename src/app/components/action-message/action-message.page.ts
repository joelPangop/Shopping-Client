import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../../services/message.service';
import {Message} from '../../models/message-interface';
import {Utilisateur} from '../../models/utilisateur-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {environment} from '../../models/environements';
import {ImageService} from '../../services/image.service';
import {ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-action-message',
    templateUrl: './action-message.page.html',
    styleUrls: ['./action-message.page.scss'],
})
export class ActionMessagePage implements OnInit {

    id;
    action;
    uid: string;
    message = {} as Message;
    msgContent: string;
    utilisateur: Utilisateur;

    constructor(private activatedRoute: ActivatedRoute, private toastCtrl: ToastController,
                private storage: NativeStorage, private msgService: MessageService, private authSrv: AuthService) {
    }

    async ngOnInit() {
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.action = this.activatedRoute.snapshot.paramMap.get('action');
        this.uid = this.activatedRoute.snapshot.paramMap.get('uid');
        console.log('params:', this.id, this.action);
        if (this.id === '1000') {
            this.message = {} as Message;
        } else {
            this.loadMessageById();
        }

    }

    loadMessageById() {
        this.msgService.loadMessageById(this.id).subscribe(res => {
            this.message = res as Message;
            if (this.message.read === false) {
                this.message.read = true;
                this.changeState();
            }
        });
    }

    toggleAction() {
        this.action = 'write';
    }

    changeState() {
        this.msgService.changeState(this.id, this.message).subscribe(res => {
            this.message = res as Message;
        });
    }

    send() {
        let id;
        const pictureId: string = this.message.picture;
        this.msgService.getUserByAvatar(pictureId).subscribe(res => {
            id = res._id;
            const url = `${environment.api_url}/Utilisateurs/${id}/messages`;
            const message: Message = {
                title: this.utilisateur.username,
                picture: this.utilisateur.avatar,
                content: this.msgContent,
                createdAt: new Date().getTime(),
                read: false,
                messageTo: res.username,
                utilisateurId: id
            };
            console.log('url et message', url, message);
            this.msgService.send(url, message).subscribe(res1 => {
                console.log('data', res);
                this.presentToast('Message envoye', 1000);
                this.msgContent = '';
            }, error => {
                console.log('Message non envoye');
                this.presentToast('Message non envoye', 1000);
            });
        });
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }

    contact() {
        const id = this.uid;
        this.authSrv.getUserById(id).subscribe(res => {
            const url = `${environment.api_url}/Utilisateurs/${id}/messages`;
            const message: Message = {
                title: this.utilisateur.username,
                picture: this.utilisateur.avatar,
                content: this.msgContent,
                createdAt: new Date().getTime(),
                read: false,
                messageTo: res.username,
                utilisateurId: id
            };
            console.log('url et message', url, message);
            this.msgService.send(url, message).subscribe(res1 => {
                this.presentToast('Message envoye', 1000);
                this.msgContent = '';
            }, error => {
                console.log('Message non envoye');
                this.presentToast('Message non envoye', 1000);
            });
        });
    }
}
