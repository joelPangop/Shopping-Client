import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../../services/message.service';
import {Message} from '../../models/message-interface';
import {Utilisateur} from '../../models/utilisateur-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {environment} from '../../models/environements';
import {AlertController, Platform, ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {Socket} from 'ngx-socket-io';
import {Notification} from '../../models/notification-interface';
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';

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
    messages = [] as Message[];
    interlocutor = {} as Utilisateur;
    alertRes;

    constructor(private activatedRoute: ActivatedRoute, private toastCtrl: ToastController, private alertController: AlertController,
                private socket: Socket, private storage: NativeStorage, private msgService: MessageService, private authSrv: AuthService,
                private platform: Platform, private localNotification: LocalNotifications) {
    }

    async ngOnInit() {
        this.socket.connect();
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.action = this.activatedRoute.snapshot.paramMap.get('action');
        this.uid = this.activatedRoute.snapshot.paramMap.get('uid');
        console.log('params:', this.id, this.action);
        if (this.id === '1000') {
            this.message = {} as Message;
        } else {
            await this.loadMessageById();
        }
        this.socket.fromEvent('notify').subscribe(notification => {
            console.log('New:', notification);
            const usr = notification['user'] as Utilisateur;
            const msg = notification['message'] as Message;
            if (usr.username !== this.utilisateur.username) {
                this.presentToast('Message recu de ' + usr.username, 1000, 'top');
                this.messages.push(msg);
            }
            // this.messages.push(message);
        });
    }

    loadAllMessages(interlocutor) {
        this.msgService.loadMessages(this.utilisateur.username, interlocutor.username).subscribe(res => {
            this.messages = res as Message[];
        });
    }

    loadInterlocutor(message) {
        this.msgService.getUserByAvatar(message.picture).subscribe(res => {
            this.interlocutor = res as Utilisateur;
            this.loadAllMessages(this.interlocutor);
        });
    }

    loadMessageById() {
        this.msgService.loadMessageById(this.id).subscribe(res => {
            this.message = res as Message;
            if (this.message.read === false) {
                this.message.read = true;
                this.changeState();
            }
            this.loadInterlocutor(this.message);
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

        id = this.interlocutor._id;
        const url = `${environment.api_url}/Utilisateurs/${id}/messages`;
        const message: Message = {
            title: this.utilisateur.username,
            picture: this.utilisateur.avatar,
            content: this.msgContent,
            createdAt: new Date().getTime(),
            read: false,
            messageTo: this.interlocutor.username,
            utilisateurId: id
        };
        console.log('url et message', url, message);
        this.msgService.send(url, message).subscribe(res1 => {
            console.log('data', this.interlocutor);
            this.messages.push(message);

            const notification: Notification = {
                title: 'Nouveaux message',
                message: 'Vous avez un nouveau message de ' + this.utilisateur.username,
                utilisateurId: this.interlocutor._id,
                avatar: this.utilisateur.avatar,
                read: false,
                sender: this.utilisateur._id
            };
            this.msgService.addNotification(notification).subscribe(res => {
                this.socket.emit('notifying', {
                    user: this.utilisateur,
                    message: message
                });
            });
            this.presentToast('Message envoye', 1000, 'bottom');
            this.msgContent = '';
        }, error => {
            console.log('Message non envoye');
            this.presentToast('Message non envoye', 1000, 'bottom');
        });
    }

    async presentToast(msg: string, duree: number, position) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree,
            position: position
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
                this.messages.push(message);
                const notification: Notification = {
                    title: 'Nouveaux message',
                    message: 'Vous avez un nouveau message de ' + this.utilisateur.username,
                    utilisateurId: this.interlocutor._id,
                    avatar: this.utilisateur.avatar,
                    read: false,
                    sender: this.utilisateur._id
                };
                this.msgService.addNotification(notification).subscribe(res => {
                    this.socket.emit('notifying', {
                        user: this.utilisateur,
                        message: message
                    });
                });
                this.presentToast('Message envoye', 1000, 'bottom');
                this.msgContent = '';
            }, error => {
                console.log('Message non envoye');
                this.presentToast('Message non envoye', 1000, 'bottom');
            });
        });
    }

    deleteMessage(msg: Message, index) {
        this.msgService.deleteMessage(msg).subscribe(async () => {
            this.messages.splice(index, 1);
            if (this.id === '1000') {
                this.message = {} as Message;
            } else {
                await this.loadMessageById();
            }
        });
    }

    async handleDeleteButtonClick($event, msg: Message, index) {
        const alert = await this.alertController.create({
            message: 'Delete this message?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.alertRes = 'No';
                        console.log(this.alertRes);
                    }
                },
                {
                    text: 'Yes',
                    role: 'OK',
                    handler: () => {
                        this.alertRes = 'Yes';
                        console.log(this.alertRes);
                        this.deleteMessage(msg, index);
                    }
                }]
        });

        return alert.present().then(r => {
            console.log('res:', r);
        });
    }

}
