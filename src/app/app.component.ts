import {Component} from '@angular/core';

import {AlertController, MenuController, NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
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
        private storage: NativeStorage,
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
        private userStorageUtils: UserStorageUtils
    ) {
        this.categories = categories;
        this.initializeApp();

    }

    async initializeApp() {
        // this.utilisateur = await this.userStorageUtils.getUser();
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
            this.userStorageUtils.getUser().then((res) => {
                console.log(res);
            })
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
