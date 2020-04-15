import {Component, OnInit} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {MessageService} from '../../services/message.service';
import {Notification} from '../../models/notification-interface';
import {Utilisateur} from '../../models/utilisateur-interface';
import {forkJoin} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Events, NavController} from '@ionic/angular';
import * as moment from 'moment';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.page.html',
    styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

    notifType;
    likeNotifications: Notification[] = [];
    messageNotifications: Notification[] = [];
    utilisateur = {} as Utilisateur;

    constructor(private storage: NativeStorage, private messageService: MessageService, private activatedRoute: ActivatedRoute,
                private navCtrl: NavController, private event: Events) {
        this.likeNotifications = [] as Notification[];
        this.messageNotifications = [] as Notification[];
    }

    async ngOnInit() {
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.notifType = this.activatedRoute.snapshot.paramMap.get('params');
        console.log(this.notifType);
        this.loadAll();
    }

    segmentChanged($event: CustomEvent) {
        // tslint:disable-next-line:no-unused-expression
        $event.detail.value;
    }

    loadAll(event?) {
        if (event) {
            // @ts-ignore
            forkJoin(this.loadMessageNotifications(), this.loadLikeNotifications());
            setTimeout(()=>{
                event.target.complete();
            },5000);
        } else {
            // @ts-ignore
            return forkJoin(this.loadMessageNotifications(), this.loadLikeNotifications());
        }
    }

    loadMessageNotifications() {
        this.messageNotifications = Array.from(new Set(this.messageService.messageNotifications.reverse().map(m => m.sender)))
            .map(sender => {
                return {
                    sender: sender,
                    _id: this.messageService.messageNotifications.find(m => m.sender === sender)._id,
                    title: this.messageService.messageNotifications.find(m => m.sender === sender).type,
                    message: this.messageService.messageNotifications.find(m => m.sender === sender).message,
                    message_id: this.messageService.messageNotifications.find(m => m.sender === sender).message_id,
                    utilisateurId: this.messageService.messageNotifications.find(m => m.sender === sender).utilisateurId,
                    avatar: this.messageService.messageNotifications.find(m => m.sender === sender).avatar,
                    createdAt: this.messageService.messageNotifications.find(m => m.sender === sender).createdAt,
                    read: this.messageService.messageNotifications.find(m => m.sender === sender).read,
                    type: this.messageService.messageNotifications.find(m => m.sender === sender).type
                };
            });
        console.log(this.messageNotifications);
    }

    loadLikeNotifications() {
        this.messageService.loadReceivedLikesNotifications(this.utilisateur._id).subscribe((res) =>{
            this.messageService.likeNotifications = res;
            this.likeNotifications = this.messageService.likeNotifications.reverse().filter((thing, i, arr) => {
                return arr.indexOf(arr.find(t => t.sender === thing.sender && t.avatar === thing.avatar)) === i;
            });

            console.log("Elements distincts",this.likeNotifications);
        })


        // this.likeNotifications = Array.from(new Set(this.messageService.likeNotifications.reverse().map(m => m.sender)))
        //     .map(sender => {
        //         return {
        //             sender: sender,
        //             _id: this.messageService.likeNotifications.find(m => m.sender === sender)._id,
        //             title: this.messageService.likeNotifications.find(m => m.sender === sender).type,
        //             message: this.messageService.likeNotifications.find(m => m.sender === sender).message,
        //             message_id: this.messageService.messageNotifications.find(m => m.sender === sender).message_id,
        //             utilisateurId: this.messageService.likeNotifications.find(m => m.sender === sender).utilisateurId,
        //             avatar: this.messageService.likeNotifications.find(m => m.sender === sender).avatar,
        //             createdAt: this.messageService.likeNotifications.find(m => m.sender === sender).createdAt,
        //             read: this.messageService.likeNotifications.find(m => m.sender === sender).read,
        //             type: this.messageService.likeNotifications.find(m => m.sender === sender).type
        //         };
        //     });
    }

    getMomentDate(date: number) {
        return moment(date).format('llll');
    }

    getMomentFromNow(date: number) {
        return moment(date).startOf('day').fromNow();
    }

    messageView(msgNotif: Notification) {
        let i= 0;
        let msgNotifs = this.messageService.messageNotifications.filter(res => res.sender === msgNotif.sender);
        for(let msgNotif of msgNotifs){
            if(msgNotif.read === false){
                i++;
                msgNotif.read = !msgNotif.read;
                this.messageService.updateNotification(msgNotif._id, msgNotif).subscribe((res) => {
                    msgNotif = res;
                });
            }
        }
        this.event.publish("nbNotif", i);
        this.navCtrl.navigateForward(`/action-message/${msgNotif.message_id}/read/${1000}`);
    }
}
