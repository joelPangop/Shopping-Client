import {Component, OnInit} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {MessageService} from '../../services/message.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Notification} from '../../models/notification-interface';
import { NavController, NavParams} from '@ionic/angular';
import * as moment from 'moment';
import {forkJoin} from 'rxjs';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {CurrencyService} from '../../services/currency.service';

@Component({
    selector: 'app-show-notification',
    templateUrl: './show-notification.page.html',
    styleUrls: ['./show-notification.page.scss'],
})
export class ShowNotificationPage implements OnInit {

    messageNotifications: Notification[] = [];
    utilisateur = {} as Utilisateur;

    constructor(private storage: NativeStorage, public messageService: MessageService, private navCtrl: NavController,
                public navParams: NavParams, private userStorageUtils: UserStorageUtils, private currencyService: CurrencyService) {
        this.messageNotifications = [] as Notification[];
    }

    async ngOnInit() {
        this.utilisateur = await this.userStorageUtils.getUser();
        this.loadAll();
    }

    loadAll() {
        forkJoin(this.loadMsgNotifications(), this.loadLikeNotifications()).subscribe((res) => {
            this.messageService.messageNotifications = [];
            this.messageService.likeNotifications = [];
            for (let notif of res[0]) {
                if (notif.read == false) {
                    this.messageService.messageNotifications.push(notif);
                }
            }
            for (let notif of res[1]) {
                if (notif.read == false) {
                    this.messageService.likeNotifications.push(notif);
                }
            }
        });
    }

    loadMsgNotifications() {
        return this.messageService.loadReceivedMessagesNotifications(this.utilisateur._id);
    }

    loadLikeNotifications() {
        return this.messageService.loadReceivedLikesNotifications(this.utilisateur._id);
    }

    goToMessages() {
        this.navCtrl.navigateRoot('notification/messages');
        const popover = this.navParams.get('popover');
        popover.dismiss();
    }

    goToLikes() {
        this.navCtrl.navigateRoot('notification/likes');
        let i= 0;
        for(let likeNotif of this.messageService.likeNotifications){
            if(likeNotif.read === false){
                i++;
                likeNotif.read = !likeNotif.read;
                this.messageService.updateNotification(likeNotif._id, likeNotif).subscribe((res) => {
                    likeNotif = res;
                });
            }
        }
        const popover = this.navParams.get('popover');
        popover.dismiss();
    }

    getMomentFromNow(date: number) {
        return moment(date).startOf('hour').fromNow();
    }
}
