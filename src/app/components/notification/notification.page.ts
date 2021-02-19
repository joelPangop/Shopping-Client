import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {Notification} from '../../models/notification-interface';
import {Utilisateur} from '../../models/utilisateur-interface';
import {forkJoin} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import * as moment from 'moment';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Message} from '../../models/message-interface';
import {Commande} from '../../models/commande-interface';
import {OrderViewPage} from '../order-view/order-view.page';
import {CommandeViewPage} from '../commande-view/commande-view.page';
import {itemCart} from '../../models/itemCart-interface';
import {CommandeService} from '../../services/commande.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.page.html',
    styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

    notifType;
    likeNotifications: Notification[] = [];
    messageNotifications: Notification[] = [];
    ordersNotifications: Notification[] = [];
    utilisateur = {} as Utilisateur;

    constructor(public messageService: MessageService, private activatedRoute: ActivatedRoute,
                private navCtrl: NavController, private userStorageUtils: UserStorageUtils,
                private modalController: ModalController, private cmdService: CommandeService) {
        this.likeNotifications = [] as Notification[];
        this.messageNotifications = [] as Notification[];
        this.ordersNotifications = [] as Notification[];
    }

    async ngOnInit() {
        this.utilisateur = await this.userStorageUtils.getUser();
        // this.notifType = this.activatedRoute.snapshot.paramMap.get('params');
        this.notifType = 'messages';
        console.log(this.notifType);
        this.loadAll();
    }

    ionViewDidEnter() {
        this.loadAll();
    }

    ionViewWillEnter() {
        this.loadAll();
    }

    changeState(message: Message) {
        message.read = true;
        this.likeNotifications.forEach((not) => {
            if (not.message_id === message._id) {
                not.read = true;
                this.messageService.updateNotification(not._id, not).subscribe((n) => {
                    not = n as Notification;
                });
                this.messageService.changeState(message._id, message).subscribe(res => {
                    message = res as Message;
                });
            }
        });
    }

    segmentChanged($event: CustomEvent) {
        // tslint:disable-next-line:no-unused-expression
        $event.detail.value;
        if (this.notifType === 'likes') {
            let likeNotificationsNotRead: Notification[] = this.messageService.likeNotifications.filter(like => {
                return like.read === false;
            });
            let count: number = this.messageService._notificationCount.value;
            if (count > 0) {
                if (likeNotificationsNotRead.length > 0) {
                    for (let msgNotif of likeNotificationsNotRead) {
                        if (msgNotif.read === false) {
                            msgNotif.read = !msgNotif.read;
                            this.messageService.updateNotification(msgNotif._id, msgNotif).subscribe((res) => {
                                msgNotif = res;
                                count = count - 1;
                                this.messageService.setNotificationCount(count);
                            });
                        }
                    }
                }
                // else {
                //     this.messageService.setNotificationCount(0);
                // }
            }
        }
    }

    loadAll(event?) {
        if (event) {
            // @ts-ignore
            forkJoin(this.loadMessageNotifications(), this.loadLikeNotifications(), this.loadOrdersNotifications());
            setTimeout(() => {
                event.target.complete();
            }, 5000);
        } else {
            // @ts-ignore
            return forkJoin(this.loadMessageNotifications(), this.loadLikeNotifications(), this.loadOrdersNotifications());
        }
    }

    loadMessageNotifications() {
        this.messageService.loadReceivedMessagesNotifications(this.utilisateur._id).subscribe((res) => {
            this.messageService.messageNotifications = res;
            this.messageNotifications = this.messageService.messageNotifications.reverse().filter((thing, i, arr) => {
                return arr.indexOf(arr.find(t => t.sender === thing.sender && t.avatar === thing.avatar
                    && t.message_id === thing.message_id && t.read == false)) === i;
            });
            // let count: number = this.messageService._notificationCount.value;
            // if (count > 0) {
            //     for (let msgNotif of this.messageNotifications) {
            //         if (msgNotif.read === false) {
            //             msgNotif.read = !msgNotif.read;
            //             this.messageService.updateNotification(msgNotif._id, msgNotif).subscribe((res) => {
            //                 msgNotif = res;
            //             });
            //         }
            //     }
            //     this.messageService.setNotificationCount(count - this.messageNotifications.length);
            // }
            console.log('Elements distincts', this.messageNotifications);
        });

        // this.messageNotifications = Array.from(new Set(this.messageService.messageNotifications.reverse().map(m => m.sender)))
        //     .map(sender => {
        //         return {
        //             sender: sender,
        //             _id: this.messageService.messageNotifications.find(m => m.sender === sender)._id,
        //             title: this.messageService.messageNotifications.find(m => m.sender === sender).type,
        //             message: this.messageService.messageNotifications.find(m => m.sender === sender).message,
        //             message_id: this.messageService.messageNotifications.find(m => m.sender === sender).message_id,
        //             article: this.messageService.messageNotifications.find(m => m.sender === sender).article,
        //             utilisateurId: this.messageService.messageNotifications.find(m => m.sender === sender).utilisateurId,
        //             avatar: this.messageService.messageNotifications.find(m => m.sender === sender).avatar,
        //             createdAt: this.messageService.messageNotifications.find(m => m.sender === sender).createdAt,
        //             read: this.messageService.messageNotifications.find(m => m.sender === sender).read,
        //             type: this.messageService.messageNotifications.find(m => m.sender === sender).type
        //         };
        //     });
        console.log(this.messageNotifications);
    }

    loadLikeNotifications() {
        this.messageService.loadReceivedLikesNotifications(this.utilisateur._id).subscribe((res) => {
            this.messageService.likeNotifications = res;
            this.likeNotifications = this.messageService.likeNotifications.reverse().filter((thing, i, arr) => {
                return arr.indexOf(arr.find(t => t.sender === thing.sender && t.avatar === thing.avatar)) === i;
            });
            console.log('Elements distincts', this.likeNotifications);
        });
    }

    loadOrdersNotifications(){
        this.messageService.loadReceivedOrdersNotifications(this.utilisateur._id).subscribe((res) => {
            this.messageService.orderNotifications = res;
            this.ordersNotifications = this.messageService.orderNotifications;
            // this.ordersNotifications = this.messageService.likeNotifications.reverse().filter((thing, i, arr) => {
            //     return arr.indexOf(arr.find(t => t.sender === thing.sender && t.avatar === thing.avatar)) === i;
            // });
            // this.ordersNotifications.forEach((res) => {
            //     this.cmdService.received_orders.push(res.items);
            // });
            console.log('Elements distincts', this.ordersNotifications);
        });
    }

    getMomentDate(date: number) {
        return moment(date).format('llll');
    }

    getMomentFromNow(date: number) {
        return moment(date).startOf('day').fromNow();
    }

    messageView(msgNotif: Notification) {
        let i = 0;
        let msgNotifs = this.messageService.messageNotifications.filter(res => res.sender === msgNotif.sender);
        // let msgNotifs = this.messageNotifications.filter(res => res.sender === msgNotif.sender);
        for (let msgNotif of msgNotifs) {
            if (msgNotif.read === false) {
                i++;
                msgNotif.read = !msgNotif.read;
                this.messageService.updateNotification(msgNotif._id, msgNotif).subscribe((res) => {
                    msgNotif = res;
                    this.messageService.loadMessageById(msgNotif.message_id).subscribe((message) => {
                        message.read = !message.read;
                        this.messageService.changeState(message._id, message).subscribe((m) => {
                            message = m;
                            let count: number = this.messageService._notificationCount.value;
                            if (count > 0) {
                                this.messageService.setNotificationCount(count - 1);
                            }
                        });
                    });

                });
            }
        }
        // this.event.publish("nbNotif", i);
        this.navCtrl.navigateForward(`/menu/tabs/action-message/${msgNotif.message_id}/read/${1000}/${msgNotif.article._id}`);
    }

    async showDetails(items: string[]) {
        let itemsCart = [];
        this.cmdService.getCmdByItem(items[0]).subscribe(async (res) => {
            let command: Commande = res;
            itemsCart = command.itemsCart.filter(
                function(e) {
                    return items.includes(e._id);
                    // return this.indexOf(e._id);
                },
                items
            );
            this.cmdService.received_orders = itemsCart;
            const modal = await this.modalController.create({
                component: CommandeViewPage,
                cssClass: 'cart-modal'
            });
            return await modal.present();
        })

    }

    order_amount(items: itemCart[]) {
        let amount = 0;
        items.forEach((it) => {
            amount += it.amount;
        });
        return amount;
    }
}
