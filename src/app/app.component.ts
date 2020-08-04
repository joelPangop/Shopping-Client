import {Component} from '@angular/core';

import {AlertController, MenuController, NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {categories} from './models/Category';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {ProductDetailPage} from './components/product-detail/product-detail.page';
import {Utilisateur} from './models/utilisateur-interface';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {Storage} from '@ionic/storage';
import {PagesService} from './services/pages.service';
import {UserStorageUtils} from './services/UserStorageUtils';
import {BehaviorSubject, Observable, timer} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {Globalization} from '@ionic-native/globalization/ngx';
import {LanguageService} from './services/language.service';
import {Notification} from './models/notification-interface';
import openSocket from 'socket.io-client';
import {Socket} from 'ngx-socket-io';
import * as io from 'socket.io-client';
import {NotificationType} from './models/notificationType';

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
    showSplash = true;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private navCtrl: NavController,
        private deepLinks: Deeplinks,
        private toastCtrl: ToastController,
        private localNotification: LocalNotifications,
        public authService: AuthService,
        public alertController: AlertController,
        public localStorage: Storage,
        private menuController: MenuController,
        private pagesService: PagesService,
        private userStorageUtils: UserStorageUtils,
        public translate: TranslateService,
        private languageService: LanguageService
        // private socket: Socket
    ) {
        this.categories = categories;
        translate.addLangs(['en', 'fr']);
        let language = this.translate.getBrowserLang();
        // translate.setDefaultLang(language);
        // translate.use(language);
        this.languageService.setLanguage(language);
        this.initializeApp();
    }

    async initializeApp() {

        // this.utilisateur = await this.userStorageUtils.getUser();
        this.platform.ready().then(async () => {

            // this.languageService.setInitialAppLanguage();
            const self = this;
            // this.userStorageUtils.setWebSocket('ws://192.168.2.58:8080');
            this.userStorageUtils.setWebSocket('wss://egoalservice.azurewebsites.net');

            this.userStorageUtils.getWebSocket().onmessage = function(event) {
                console.log(event.data);
                let result: Notification = JSON.parse(event.data);
                let msg = '';
                if (result.article.utilisateurId === self.authService.currentUser._id) {
                    self.authService.getUserById(result.sender).subscribe((res) => {
                        const user = res;
                        if (result.type === NotificationType.MESSAGE) {
                            msg = 'Nouveaux message de ' + user.userInfo.firstName;
                        }
                        if (result.type === NotificationType.LIKE) {
                            msg = 'Nouveaux like de ' + user.userInfo.firstName;
                        }
                        self.presentToast(msg);
                    });
                }
            };
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
            this.userStorageUtils.getUser().then((res) => {
                console.log(res);
            });
            this.authService.isAuthenticated.subscribe(state => {
                if (state) {
                    this.router.navigate(['menu/tabs/tab1']);
                } else {
                    this.router.navigate(['menu/tabs/products']);
                }
            });
            // await this.router.navigate(['']);
            // Get Menus For Side Menu
            this.appPages = this.pagesService.getPages();
        });
        timer(3000).subscribe(() => this.showSplash = false);
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

    switchLang(lang: string) {
        this.translate.use(lang);
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
