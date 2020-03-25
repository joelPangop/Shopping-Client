import {Component} from '@angular/core';

import {NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {categories} from './models/Category';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {ProductDetailPage} from './components/product-detail/product-detail.page';
import {Socket} from 'ngx-socket-io';
import {Utilisateur} from './models/utilisateur-interface';
import {Message} from './models/message-interface';
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {NetworkInterface} from '@ionic-native/network-interface/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    categories: any[];
    utilisateur: Utilisateur;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: NativeStorage,
        private navCtrl: NavController,
        private deepLinks: Deeplinks,
        private socket: Socket,
        private toastCtrl: ToastController,
        private localNotification: LocalNotifications
    ) {
        this.categories = categories;
        this.initializeApp();
    }

    async initializeApp() {
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.socket.connect();
        this.platform.ready().then(async () => {
            const loggedIn = await this.storage.getItem('isLoggedIn');
            this.statusBar.backgroundColorByHexString('0bb8cc');
            this.deepLinks.routeWithNavController(this.navCtrl, {
                'product-detail/:id': ProductDetailPage
            }).subscribe(match => {
                // match.$route - the route we matched, which is the matched entry from the arguments to route()
                // match.$args - the args passed in the link
                // match.$link - the full link data
                console.log('Successfully matched route', match);
                this.navCtrl.navigateRoot(match.$link.path);
            }, nomatch => {
                // nomatch.$link - the full link data
                console.error('Got a deeplink that didn\'t match', nomatch);
            });
            if (loggedIn) {
                console.log('Deja connecte');
                await this.navCtrl.navigateRoot('/intro');
            }
            this.splashScreen.hide();
        });

        this.socket.fromEvent('notify').subscribe(notification => {
            console.log('New:', notification);
            const usr = notification['user'] as Utilisateur;
            const msg = notification['message'] as Message;
            this.localNotification.schedule({
                title: 'Message',
                text: 'Message recu de ' + usr.username,
                trigger: {
                    in: 0,
                    unit: ELocalNotificationTriggerUnit.SECOND
                }
            });
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

    showCategory(title: string) {
        this.navCtrl.navigateForward('/category/' + title);
        console.log('catTitle', title);
    }

    goTo(route: string) {
        this.navCtrl.navigateForward(`/${route}`);
        console.log('route', `/${route}`);
    }
}
