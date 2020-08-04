import {Component, OnInit} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {MessageService} from '../../services/message.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Message} from '../../models/message-interface';
import {forkJoin} from 'rxjs';
import {Notification} from '../../models/notification-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';

@Component({
    selector: 'app-messagerie',
    templateUrl: './messagerie.page.html',
    styleUrls: ['./messagerie.page.scss'],
})
export class MessageriePage implements OnInit {
    messageType = 'received';
    utilisateur = {} as Utilisateur;
    messages = [] as Message[];
    messages_received = [] as Message[];
    messages_sent = [] as Message[];
    notifications = [] as Notification[];
    msgContent: any;
    unread_number: number = 0;

    constructor(public platform: Platform, public msgservice: MessageService,
                private navCtrl: NavController, private userStorageUtils: UserStorageUtils) {
    }

    async ngOnInit() {
        this.utilisateur = await this.userStorageUtils.getUser();
        this.loadAll().subscribe(res => {
            console.log('result', res);
            this.messages = res [0];
            if (this.messages.length > 0) {
                this.messages.sort(this.compare);
                this.messages_received.push(this.messages[this.messages.length - 1]);
                for (let i = this.messages.length - 1; i > 0; i--) {
                    if (this.messages[i].read === false) {
                        this.unread_number++;
                    }
                    if (this.messages[i].title !== this.messages[i - 1].title) {
                        this.unread_number = 0;
                        this.messages_received.push(this.messages[i]);
                    }
                }
            } else {
                this.messages_received = res[0];
            }

            this.messages_sent = res [1];
            this.notifications = res [2];
        });
    }

    segmentChanged($event: CustomEvent) {
        // tslint:disable-next-line:no-unused-expression
        $event.detail.value;
    }

    loadAll(event?) {
        if (event) {
            forkJoin(this.loadReceivedMessages(), this.loadSent(), this.loadReceivedNotifications()).subscribe(res => {
                console.log('result', res);
                const msg_rec = res [0];
                this.messages_received = msg_rec.reverse().filter((thing, i, arr) => {
                    return arr.indexOf(arr.find(t => t.article._id === thing.article._id && t.article.pictures[0] === thing.article.pictures[0])) === i;
                });
                this.messages_sent = res [1];
                this.notifications = res [2];
                event.target.complete();
            });
        } else {
            return forkJoin(this.loadReceivedMessages(), this.loadSent(), this.loadReceivedNotifications());
        }
    }

    loadReceivedMessages() {
        return this.msgservice.loadReceivedMessages(this.utilisateur._id);
    }

    loadSent() {
        return this.msgservice.loadSent(this.utilisateur.username);
    }

    loadReceivedNotifications() {
        return this.msgservice.loadReceivedMessagesNotifications(this.utilisateur._id);
    }

    messageWrite(msg: Message, i: number) {
        this.navCtrl.navigateRoot(`/action-message/${msg._id}/write/${1000}/${msg.article._id}`);
    }

    messageView(msg: Message, i: number) {
        this.unread_number = 0;
        this.navCtrl.navigateRoot(`/action-message/${msg._id}/read/${msg.utilisateurId}/${msg.article._id}`);
        // this.navCtrl.navigateForward(`/action-message/${msg._id}/read/${1000}/${msg.article._id}`);
    }

    compare = (a, b) => {
        // Use toUpperCase() to ignore character casing
        const bandA = a.title.toUpperCase();
        const bandB = b.title.toUpperCase();

        let comparison = 0;
        if (bandA !== bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    };

}
