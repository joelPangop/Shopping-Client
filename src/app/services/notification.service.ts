import {Injectable} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private alertController: AlertController, private localNotifications: LocalNotifications, private platform: Platform) {
    }

    notify(msg) {
        if (!('Notification' in window)) {
            this.presentAlert('This browser does not support desktop notification, try Chromium');
        } else if (Notification.permission === 'granted') {
            const notification = new Notification('Chat App', {
                body: msg,
                icon: '/assets/icon/e-com-icon.png'
            });
            notification.onclick = (event) => {
                event.preventDefault();
                document.close();
            };
        } else if (Notification.permission === 'denied') {
            Notification.requestPermission((permission) => {
                if (permission === 'granted') {
                    const notification = new Notification('Chat App', {
                        body: msg,
                        icon: '/assets/icon/e-com-icon.png'
                    });
                    notification.onclick = (event) => {
                        event.preventDefault();
                        document.close();
                    };
                }
            });
        }
    }

    scheduleNotification(msg, data){
        this.localNotifications.schedule({
            id: 1,
            title: msg,
            text: msg,
            trigger: {in: 1, unit: ELocalNotificationTriggerUnit.SECOND},
            sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
            data: {myData: data},
            icon: '/assets/icon/e-com-icon.png',
        });
    }

    async presentAlert(msg: any): Promise<void> {
        const alert = await this.alertController.create({
            message: msg,
            buttons: ['OK']
        });
        await alert.present();
    }


}
