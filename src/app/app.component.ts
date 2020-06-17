import {Component} from '@angular/core';

import {AlertController, MenuController, NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {categories} from './models/Category';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {ProductDetailPage} from './components/product-detail/product-detail.page';
import {Socket} from 'ngx-socket-io';
import {Utilisateur} from './models/utilisateur-interface';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {Storage} from '@ionic/storage';
import {PagesService} from './services/pages.service';
import {UserStorageUtils} from './services/UserStorageUtils';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    categories: any[];
    utilisateur: Utilisateur;

    public appPages = [];
    isMain: boolean = true;
    public catTitle: string;

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
        public authService: AuthService,
        public alertController: AlertController,
        public localStorage: Storage,
        private menuController: MenuController,
        private pagesService: PagesService,
        private userStorageUtils: UserStorageUtils
    ) {
        this.categories = categories;
        this.initializeApp();

    }

    //
    // async initializeApp() {
    //     // this.utilisateur = await this.storage.getItem('Utilisateur');
    //
    //     this.platform.ready().then(async () => {
    //         this.socket.connect();
    //         // const loggedIn = await this.storage.getItem('isLoggedIn');
    //         if (this.platform.is('ios') || this.platform.is('android')) {
    //             this.utilisateur = await this.storage.getItem('Utilisateur');
    //         } else if (!this.platform.is('ios') && !this.platform.is('android')) {
    //             this.utilisateur = await this.localStorage.get('Utilisateur');
    //         }
    //         this.statusBar.backgroundColorByHexString('0bb8cc');
    //         this.deepLinks.routeWithNavController(this.navCtrl, {
    //             'product-detail/:id': ProductDetailPage
    //         }).subscribe(match => {
    //             console.log('Successfully matched route', match);
    //             this.navCtrl.navigateRoot(match.$link.path);
    //         }, nomatch => {
    //             // nomatch.$link - the full link data
    //             console.error('Got a deeplink that didn\'t match', nomatch);
    //         });
    //         this.splashScreen.hide();
    //         // Get Menus For Side Menu
    //         this.authService.authenticationState.subscribe(state => {
    //             if (state) {
    //                 // this.router.navigate(['menu/product-list']);
    //                 let page;
    //                 if (this.platform.is('ios') || this.platform.is('android')) {
    //                     page = this.storage.getItem('page');
    //                 } else if (!this.platform.is('ios') && !this.platform.is('android')) {
    //                     page = this.localStorage.get('page');
    //                 }
    //                 page.then(r => console.log(r));
    //
    //                 this.router.navigate(['tabs']);
    //                 // this.router.navigate(['menu/product-list']);
    //             } else {
    //                 this.router.navigate(['']);
    //             }
    //         });
    //         let notificationOpenedCallback = function(jsonData) {
    //             console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    //         };
    //     });
    //
    //     this.socket.fromEvent('notify').subscribe(notification => {
    //         console.log('New:', notification);
    //         const usr = notification['user'] as Utilisateur;
    //         const msg = notification['message'];
    //         if (msg.message.messageTo && this.utilisateur.username === msg.message.messageTo) {
    //             if (this.platform.is('ios') || this.platform.is('android')) {
    //                 this.presentToast(msg.title, 1500, 'top');
    //                 this.localNotification.schedule({
    //                     title: 'Message',
    //                     text: 'Message recu de ' + usr.username,
    //                     icon: 'assets/e-com-img.svg',
    //                     smallIcon: usr.avatar,
    //                     trigger: {
    //                         in: 0,
    //                         unit: ELocalNotificationTriggerUnit.SECOND
    //                     }
    //                 });
    //                 this.event.publish('addNotif', 1);
    //                 // this.presentAlert(msg.message);
    //             } else {
    //                 this.presentToast(msg.message.title, 1500, 'top');
    //             }
    //         }
    //     });
    // }
    //
    // async presentToast(msg: string, duree: number, position) {
    //     const toast = await this.toastCtrl.create({
    //         message: msg,
    //         duration: duree,
    //         position: position
    //     });
    //     await toast.present();
    // }
    //
    // showCategory(title: string) {
    //     this.navCtrl.navigateForward('/category/' + title);
    //     console.log('catTitle', title);
    // }
    //
    // goTo(route: string) {
    //     this.navCtrl.navigateForward(`/${route}`);
    //     console.log('route', `/${route}`);
    // }
    //
    // async presentAlert(data: Message) {
    //     const alert = await this.alertController.create({
    //         header: data.title,
    //         message: data.content,
    //         buttons: ['OK']
    //     });
    //     await alert.present();
    // }

    async initializeApp() {
        this.utilisateur = await this.userStorageUtils.getUser();
        this.platform.ready().then(async () => {

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
            // @ts-ignore
            // await this.authService.isAuthenticated();
            this.authService.isAuthenticated().subscribe(state => {
                if (state) {
                    // this.router.navigate(['menu/product-list']);
                    // let page;
                    // if (this.platform.is('ios') || this.platform.is('android')) {
                    //     page = this.storage.getItem('page');
                    // } else if (!this.platform.is('ios') && !this.platform.is('android')) {
                    //     page = this.localStorage.get('page');
                    // }
                    // page.then(r => console.log(r));
                    this.router.navigate(['menu/tabs/tab1']);
                } else {
                    this.router.navigate(['menu/tabs']);
                }
            });
            // await this.router.navigate(['']);
            // Get Menus For Side Menu
            this.appPages = this.pagesService.getPages();
        });
    }

    async signout() {
        await this.menuController.enable(false); // Make Sidemenu disable
        await this.authService.logout();
    }

    backToMain() {
        this.isMain = true;
        this.catTitle = '';
        this.appPages = this.pagesService.getPages();
    }

    goToSubMain(sub) {
        if (sub.isParent) {
            this.isMain = false;
            this.menuController.isOpen('true');
            switch (sub.cat) {
                case 'Automobile':
                    this.appPages = this.pagesService.getAutoPages();
                    this.catTitle = 'Automobile';
                    break;
                case 'Mode':
                    this.appPages = this.pagesService.getModePages();
                    this.catTitle = 'Mode';
                    break;
                case 'Electronique':
                    this.appPages = this.pagesService.getElectroniquesPages();
                    this.catTitle = 'Electronique';
                    break;
                case 'House':
                    this.appPages = this.pagesService.getHousePages();
                    this.catTitle = 'House';
                    break;
                case 'Office-industrie':
                    this.appPages = this.pagesService.getWorkIndustriePages();
                    this.catTitle = 'Office & Industry';
                    break;
                case 'Gadget':
                    this.appPages = this.pagesService.getGadgetPages();
                    this.catTitle = 'Gadget';
                    break;
            }
        }
    }

}
