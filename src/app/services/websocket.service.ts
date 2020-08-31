import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {AlertController, ToastController} from '@ionic/angular';
import {Notification} from '../models/notification-interface';
import {NotificationType} from '../models/notificationType';
import {StorageService} from './storage.service';
import {NotificationService} from './notification.service';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public webSocket: WebSocket;

  constructor(private router: Router, public authService: AuthService, public alertController: AlertController,
              private toastCtrl: ToastController,
              private notificationService: NotificationService,
              private msgService: MessageService) { }

  getWebSocket(): WebSocket {
    return this.webSocket;
  }

  setWebSocket(url: string): void {
    this.webSocket = new WebSocket(url);
    // this.sleep();
  }

  async sleep() {
    await new Promise(r => {
      setTimeout(r, 2000);
    });
  }

  init(url: string) {
    const self = this;

    if (this.webSocket) {
      this.webSocket.onerror = this.webSocket.onopen = this.webSocket.onclose = null;
      this.webSocket.close();
    }
    this.setWebSocket(url);
    this.webSocket.onopen = () => {
      console.log('Websocket connected');
    };
    this.webSocket.onmessage = (event) => {
      console.log(event.data);
      let result: Notification = JSON.parse(event.data);
      let msg = '';
      if (result.sender !== self.authService.currentUser._id && result.utilisateurId === self.authService.currentUser._id) {
        self.authService.getUserById(result.sender).subscribe((res) => {
          const user = res;
          if (result.type === NotificationType.MESSAGE) {
            msg = 'Nouveaux message de ' + user.username;
            // Schedule a single notification
            self.msgService.loadMessageById(result.message_id).subscribe((message) => {
              if (self.router.routerState.snapshot.url.includes('action-message')) {
                message.read = true;
                result.read = true;
                self.msgService.changeState(message._id, message).subscribe((m) => {
                  message = m;
                  self.notificationService.scheduleNotification(msg, event.data);
                  self.notificationService.notify(msg);
                  self.msgService.messages.push(message);
                  self.msgService.updateNotification(result._id, result).subscribe((not) => {
                    result = not;
                  });
                });
              } else {
                self.msgService.loadAllNotifications(self.authService.currentUser._id).subscribe((res) => {
                  let not = res.filter((r) => {
                    return r.read === false;
                  });
                  self.msgService.setNotificationCount(not.length);
                  self.msgService.messages.push(message);
                });
              }
            });
          }
          if (result.type === NotificationType.LIKE) {
            msg = 'Nouveaux like de ' + user.username;
            self.notificationService.notify(msg);
            self.notificationService.scheduleNotification(msg, event.data);
            let count = self.msgService._notificationCount.value;
            count++;
            self.msgService.setNotificationCount(count);
          }
          self.presentToast(msg);
        });
      }
    };
    // this.webSocket.close = () => {
    //   this.webSocket = null;
    // };
  }

  async presentAlert(msg: any): Promise<void> {
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}
