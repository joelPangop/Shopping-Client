import {Component} from '@angular/core';

import {AlertController, Events, NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {categories} from './models/Category';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {ProductDetailPage} from './components/product-detail/product-detail.page';
import {Socket} from 'ngx-socket-io';
import {Utilisateur} from './models/utilisateur-interface';
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {LanguageService} from './services/language.service';
import {Message} from './models/message-interface';

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
        private router: Router,
        private navCtrl: NavController,
        private deepLinks: Deeplinks,
        private socket: Socket,
        private toastCtrl: ToastController,
        private localNotification: LocalNotifications,
        private authService: AuthService,
        public alertController: AlertController,
        private event: Events
    ) {
        this.categories = categories;
        this.initializeApp();

    }

    async initializeApp() {
        // this.utilisateur = await this.storage.getItem('Utilisateur');

        this.platform.ready().then(async () => {
            this.socket.connect();
            // const loggedIn = await this.storage.getItem('isLoggedIn');
            this.utilisateur = await this.storage.getItem('Utilisateur');
            this.statusBar.backgroundColorByHexString('0bb8cc');
            this.deepLinks.routeWithNavController(this.navCtrl, {
                'product-detail/:id': ProductDetailPage
            }).subscribe(match => {
                console.log('Successfully matched route', match);
                this.navCtrl.navigateRoot(match.$link.path);
            }, nomatch => {
                // nomatch.$link - the full link data
                console.error('Got a deeplink that didn\'t match', nomatch);
            });
            this.splashScreen.hide();
            this.authService.authenticationState.subscribe(state => {
                if (state) {
                    // this.router.navigate(['menu/product-list']);
                    let page = this.storage.getItem('page');
                    page.then(r => console.log(r));
                    this.router.navigate(['menu/product-list']);
                } else {
                    this.router.navigate(['intro']);
                }
            });
            let notificationOpenedCallback = function(jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            };
        });

        this.socket.fromEvent('notify').subscribe(notification => {
            console.log('New:', notification);
            const usr = notification['user'] as Utilisateur;
            const msg = notification['message'];
            if (msg.message.messageTo && this.utilisateur.username === msg.message.messageTo) {
                if (this.platform.is('ios') || this.platform.is('android')) {
                    this.presentToast(msg.title, 1500,'top');
                    this.localNotification.schedule({
                        title: 'Message',
                        text: 'Message recu de ' + usr.username,
                        icon: 'assets/cart.png',
                        trigger: {
                            in: 0,
                            unit: ELocalNotificationTriggerUnit.SECOND
                        }
                    });
                    this.event.publish('addNotif', 1);
                    // this.presentAlert(msg.message);
                } else {
                    this.presentToast(msg.message.title, 1500,'top');
                }
            }
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

    async presentAlert(data: Message) {
        const alert = await this.alertController.create({
            header: data.title,
            message: data.content,
            buttons: ['OK']
        });
        await alert.present();
    }
}
