import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';
import {Utilisateur} from '../../models/utilisateur-interface';
import {PagesService} from '../../services/pages.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
    categories: any[];
    utilisateur: Utilisateur;
    signOption: string;

    public appPages = [];
    isMain: boolean = true;
    public catTitle: string;

    tdsPage = {
        title: 'TDS Sneaker',
        url: '/tds-sneaker-page/all',
        src: 'assets/tds.svg'
    };

    status: boolean;

    log = {
        title: status ? 'MENU.deconnexion' : 'MENU.connexion',
        icon: status ? 'log-out' : 'log-in'
    };

    store = {
        title: 'MENU.store',
        url: '/menu/store',
        src: 'assets/bxs-store-alt.svg'
    };

    constructor(private languageService: LanguageService, private authService: AuthService, private router: Router,
                private menuController: MenuController,
                private pagesService: PagesService,
                private userStorageUtils: UserStorageUtils) {
        // this.menuController.enable(true); // Enable side menu
        this.userStorageUtils.getUser().then(res => {
            this.utilisateur = res as Utilisateur;
            if (this.utilisateur._id) {
                this.signOption = 'Signout';
            } else {
                this.signOption = 'Sign In';
            }
        });
    }

    ngOnInit() {
        this.userStorageUtils.getUser().then(res => {
            this.utilisateur = res as Utilisateur;
        });
        this.appPages = this.pagesService.getPages();
        this.authService.isAuthenticated.subscribe((state) => {
            if (state) {
                this.status = true;
            } else {
                this.status = false;
            }
        });
    }

    logOut() {
        this.router.navigate(['intro']).then(r => this.authService.logout());
    }

    async sign() {
        await this.menuController.enable(false); // Make Sidemenu disable
        if (this.utilisateur._id) {
            await this.router.navigate(['onbroading']).then(r => this.authService.logout());
        } else {
            await this.router.navigate(['landing-page']);
        }
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
