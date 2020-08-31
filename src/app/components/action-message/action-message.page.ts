import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../../services/message.service';
import {Message} from '../../models/message-interface';
import {Utilisateur} from '../../models/utilisateur-interface';
import {environment} from '../../models/environements';
import {AlertController, IonNav, NavController, Platform, ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {Notification} from '../../models/notification-interface';
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {NotificationType} from '../../models/notificationType';
import {Article} from '../../models/article-interface';
import {ArticleService} from '../../services/article.service';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {Observable} from 'rxjs';
import {CurrencyService} from '../../services/currency.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Socket} from 'ngx-socket-io';
import {NotificationService} from '../../services/notification.service';
import {WebsocketService} from '../../services/websocket.service';

@Component({
    selector: 'app-action-message',
    templateUrl: './action-message.page.html',
    styleUrls: ['./action-message.page.scss'],
})
export class ActionMessagePage implements OnInit {

    id;
    action;
    uid: string;
    artId: string;
    message = {} as Message;
    msgContent: string;
    utilisateur: Utilisateur;
    messages = [] as Message[];
    interlocutor = {} as Utilisateur;
    alertRes;
    article = {} as Article;
    image: any;
    article_title: string;

    constructor(private activatedRoute: ActivatedRoute, private toastCtrl: ToastController, private alertController: AlertController,
                public msgService: MessageService, public authSrv: AuthService,
                private platform: Platform, private localNotification: LocalNotifications,
                public articleService: ArticleService, private navCtrl: NavController, public cuService: CurrencyService,
                private userStorageUtils: UserStorageUtils, private websocketService: WebsocketService,
                public router: Router) {
    }

    async ngOnInit() {
        // this.socket.connect();
        this.utilisateur = await this.userStorageUtils.getUser();
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.action = this.activatedRoute.snapshot.paramMap.get('action');
        this.uid = this.activatedRoute.snapshot.paramMap.get('uid');
        this.artId = this.activatedRoute.snapshot.paramMap.get('artId');
        await this.loadArticle();
        // this.userStorageUtils.getWebSocket().onopen = (ev) => {
        //     console.log('websocket connected !!');
        //     console.log(ev);
        // };
        if (this.uid) {
            await this.authSrv.getUserById(this.uid).subscribe((res) => {
                this.interlocutor = res;
                console.log('interlocutor:', this.interlocutor);
            });
        }
        console.log('params:', this.id, this.action);
        if (this.id === '1000') {
            this.message = {} as Message;
        } else {
            await this.loadMessageById();
        }
        // this.socket.fromEvent('notify').subscribe(notification => {
        //     console.log('New:', notification);
        //     const usr = notification['user'] as Utilisateur;
        //     const msg = notification['message'];
        //     if (usr.username !== this.utilisateur.username) {
        //         // this.presentToast('Message recu de ' + usr.username, 1000, 'top');
        //         msg.message.read = true;
        //         this.message = msg.message;
        //         this.messages.push(msg.message);
        //     }
        //
        //     // this.messages.push(message);
        // });
        console.log('active page', this.router.routerState.snapshot.url);
    }

    ionViewWillLeave() {
        for (let message of this.msgService.messages) {
            if (message.read === false) {
                message.read = true;
                this.changeState(message);
            }
        }
    }

    ionViewDidLeave() {
        for (let message of this.msgService.messages) {
            if (message.read === false) {
                message.read = true;
                this.changeState(message);
            }
        }
    }

    ionViewDidEnter() {
        for (let message of this.msgService.messages) {
            if (message.read === false) {
                message.read = true;
                this.changeState(message);
            }
        }
    }

    // @ts-ignore
    loadArticle(): Observable<Article> {
        this.articleService.loadArticle(this.artId).subscribe(res => {
            this.articleService.article = res as Article;
            this.image = this.articleService.article.pictures[0];
            this.article_title = this.articleService.article.title;
        });
    }

    loadAllMessages(interlocutor) {
        this.msgService.loadMessages(this.utilisateur.username, interlocutor.username, this.artId).subscribe((res) => {
            this.msgService.messages = res as Message[];
            console.log('res', res);
            this.msgService.messages.forEach((msg) => {
                this.changeState(msg);
            });
            // this.messages = res.reverse().filter((thing, i, arr) => {
            //     return arr.indexOf(arr.find(t => t.article._id === thing.article._id)) === i;
            // });
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
            this.msgService.message = res as Message;
            this.loadInterlocutor(this.msgService.message);
        });
    }

    toggleAction() {
        this.action = 'write';
    }

    changeState(message) {
        this.msgService.changeState(this.id, message).subscribe(res => {
            this.msgService.message = res as Message;
        });
    }

    send() {
        let id;
        const pictureId: string = this.message.picture;

        id = this.interlocutor._id;
        const url = `${environment.api_url1}/Utilisateurs/${id}/messages`;
        const message: Message = {
            title: this.utilisateur.username,
            picture: this.utilisateur.avatar,
            content: this.msgContent,
            createdAt: new Date().getTime(),
            article: this.articleService.article,
            read: false,
            messageTo: this.interlocutor.username,
            utilisateurId: this.utilisateur._id
        };
        console.log('url et message', url, message);
        this.msgService.send(url, message).subscribe(res1 => {
            console.log('data', this.interlocutor);

            const msg = res1 as Message;
            const notification: Notification = {
                title: 'Nouveaux message',
                message: 'Vous avez un nouveau message de ' + this.utilisateur.username,
                message_id: msg._id,
                utilisateurId: this.interlocutor._id,
                avatar: this.utilisateur.avatar,
                article: msg.article,
                read: false,
                type: NotificationType.MESSAGE,
                sender: this.utilisateur._id
            };
            this.msgService.addNotification(notification).subscribe(res => {
                let not = res as Notification;
                let res_str = JSON.stringify(not);
                this.websocketService.getWebSocket().send(res_str);
                this.msgService.messages.push(message);
                // this.msgService.loadAllNotifications(this.utilisateur._id).subscribe((res) => {
                //     console.log(res);
                //     this.msgService.setNotificationCount(res.length);
                // });
                // this.localNotification.schedule({
                //     id: 1,
                //     title: notification.message,
                //     text: message.content,
                //     icon: 'assets/cart.png',
                //     data: { notification: notification }
                // });
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
                article: this.articleService.article,
                createdAt: new Date().getTime(),
                read: false,
                messageTo: res.username,
                utilisateurId: id
            };
            console.log('url et message', url, message);
            this.msgService.send(url, message).subscribe(res1 => {
                this.msgService.messages.push(message);
                const msg = res1 as Message;
                const notification: Notification = {
                    title: 'Nouveaux message',
                    message: 'Vous avez un nouveau message de ' + this.utilisateur.username,
                    message_id: msg._id,
                    utilisateurId: this.interlocutor._id,
                    article: msg.article,
                    avatar: this.utilisateur.avatar,
                    read: false,
                    type: NotificationType.MESSAGE,
                    sender: this.utilisateur._id
                };
                this.msgService.addNotification(notification).subscribe(res => {
                    let not = res as Notification;
                    let res_str = JSON.stringify(not);
                    this.websocketService.getWebSocket().send(res_str);
                    // this.socket.emit('notifying', {
                    //     user: this.utilisateur,
                    //     message: message
                    // });
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
            this.msgService.messages.splice(index, 1);
            if (this.id === '1000') {
                this.msgService.message = {} as Message;
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

    showDetails(id: string) {
        this.navCtrl.navigateForward('/product-detail/' + id);
    }
}
