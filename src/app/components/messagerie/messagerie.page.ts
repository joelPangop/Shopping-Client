import {Component, OnInit} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {MessageService} from '../../services/message.service';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Message} from '../../models/message-interface';
import {forkJoin, Observable} from 'rxjs';
import {Notification} from '../../models/notification-interface';

@Component({
    selector: 'app-messagerie',
    templateUrl: './messagerie.page.html',
    styleUrls: ['./messagerie.page.scss'],
})
export class MessageriePage implements OnInit {
    messageType = 'received';
    utilisateur = {} as Utilisateur;
    messages_received = [] as Message[];
    messages_sent = [] as Message[];
    notifications = [] as Notification[];

    constructor(public platform: Platform, public msgservice: MessageService, private storage: NativeStorage,
                private navCtrl: NavController) {

    }

    async ngOnInit() {
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.loadAll().subscribe(res => {
            console.log('result', res);
            this.messages_received = res [0];
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
                this.messages_received = res [0];
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
        return this.msgservice.loadReceivedNotifications(this.utilisateur._id);
    }

    messageWrite(msg: Message, i: number) {
        this.navCtrl.navigateForward(`/action-message/${msg._id}/write/${1000}`);
    }

    messageView(msg: Message, i: number) {
        this.navCtrl.navigateForward(`/action-message/${msg._id}/read/${1000}`);
    }

}
