import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NavController, ToastController} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    // tslint:disable-next-line:ban-types
    username: String = '';

    pages = [];
    selectedPath = '';

    constructor(private authService: AuthService, private storage: NativeStorage, private router: Router,
                private toastController: ToastController, private navCtrl: NavController) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.pages = [
            {
                title: 'Vetements',
                description: 'description',
                icon: 'shirt',
                url: '/category/Vetements'
            },
            {
                title: 'Electroniques',
                description: 'description',
                icon: 'phone-portrait',
                url: '/category/electroniques'
            },
            {
                title: 'Mode & Accessoires',
                description: 'description',
                icon: 'bowtie',
                url: '/category/Mode & Accessoires'
            },
            {
                title: 'Chaussures',
                description: 'description',
                icon: 'archive',
                url: '/category/Chaussures'
            }
        ];

        this.username = this.authService.currentUser.username;
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
