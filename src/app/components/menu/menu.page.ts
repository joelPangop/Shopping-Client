import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MenuController, PopoverController} from '@ionic/angular';
import {Utilisateur} from '../../models/utilisateur-interface';
import {PagesService} from '../../services/pages.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {Currencies} from '../../models/Currencies';
import {BehaviorSubject} from 'rxjs';

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

    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    icon;
    currency;

    constructor(public authService: AuthService, private router: Router,
                private menuController: MenuController,
                private pagesService: PagesService,
                private userStorageUtils: UserStorageUtils, private popoverController: PopoverController) {
        // this.menuController.enable(true); // Enable side menu
        // this.userStorageUtils.getUser().then(res => {
        //     this.utilisateur = res as Utilisateur;
        //     if (this.authService.currentUser._id) {
        //         this.signOption = 'Signout';
        //     } else {
        //         this.signOption = 'Sign In';
        //     }
        // });
        if (this.authService.currentUser._id) {
            this.signOption = 'Signout';
        } else {
            this.signOption = 'Sign In';
        }
    }

    ngOnInit() {
        // this.userStorageUtils.getUser().then(res => {
        this.utilisateur = this.authService.currentUser;
        // });
        if (this.authService.currentUser._id) {
            this.signOption = 'Signout';
        } else {
            this.signOption = 'Sign In';
        }
        this.appPages = this.pagesService.getPages();
        this.authService.isAuthenticated.subscribe((state) => {
            if (state) {
                this.status = true;
            } else {
                this.status = false;
            }
        });

        if (this.utilisateur.currency) {
            this.icon = this.utilisateur.currency.icon;
            this.currency = this.utilisateur.currency.currency;
        } else {
            this.icon = 'assets/' + Currencies['CAD'] + '.svg';
            this.currency = Currencies.CAD;
        }
    }

    async logOut() {
        await this.router.navigate(['onbroading']).then(r => this.authService.logout());
    }

    async sign() {
        if (this.authService.currentUser._id) {
            if (this.authService.logout()) {
                await this.router.navigate(['menu/tabs/tab1']);
            }
        } else {
            await this.menuController.enable(false); // Make Sidemenu disable
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

    public async setCurrency(ev) {
        // @ts-ignore
        const popover = await this.popoverController.create({
            component: ShowOptionsPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                currOptionSubject: this.currOptionSubject,
                currIconOptionSubject: this.currIconOptionSubject,
                currency: this.utilisateur.currency ? this.utilisateur.currency.currency : 'CAD',
                currencyIcon: this.utilisateur.currency ? this.utilisateur.currency.icon : 'assets/' + Currencies.CAD + '.svg',
                option: 'currency'
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                if (data.data) {
                    console.log(data.data);
                    this.currency = data.data.currency;
                    this.icon = data.data.icon;
                    this.authService.currency = data.data;
                }
            });
        return await popover.present();
    }
}
