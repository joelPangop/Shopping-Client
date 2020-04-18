import {Component, OnInit} from '@angular/core';
import {AlertController, Events, NavController, Platform, PopoverController} from '@ionic/angular';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article-interface';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {CurrencyService} from '../../services/currency.service';
import {ShowNotificationPage} from '../show-notification/show-notification.page';
import {MessageService} from '../../services/message.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Socket} from 'ngx-socket-io';
import {Message} from '../../models/message-interface';

@Component({
    selector: 'app-top-header',
    templateUrl: './top-header.page.html',
    styleUrls: ['./top-header.page.scss']
})
export class TopHeaderPage implements OnInit {

    isSearch: boolean;
    private articles: any;
    // @ts-ignore
    langOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    // @ts-ignore
    currIconOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    language;
    currency;
    currencyIcon;
    showLoadingSpining = false;
    private utilisateur: Utilisateur;
    notif_number: number;

    constructor(public platform: Platform, private popoverController: PopoverController, private articleService: ArticleService,
                private navCtrl: NavController, private languageService: LanguageService, private cuService: CurrencyService,
                private event: Events, private msgservice: MessageService, private storage: NativeStorage, private socket: Socket,
                private alertController: AlertController) {
        this.isSearch = false;
        this.event.subscribe('showLoadingSpining', (res) => {
            this.showLoadingSpining = res;
        });
        this.event.subscribe('nbNotif', (res) => {
            this.notif_number -= res;
            console.log('notifs number', this.notif_number);
        });
        this.event.subscribe('addNotif', (res) => {
            this.notif_number = this.notif_number + res;
            // this.presentAlert(this.notif_number);
            console.log('notifs number', this.notif_number);
        });
    }

    ionViewWillEnter(){

    }

    async ngOnInit() {
        this.socket.connect();
        this.showLoadingSpining = false;
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.language = 'FR';
        this.currency = 'CAD';
        this.currencyIcon = 'flag-for-flag-canada';
        this.isSearch = false;
        this.loadAll();
        console.log(this.platform.platforms());
        this.articleService.loadArticles().subscribe(res => {
            this.articleService.articles = res as Article[];
        });
        this.languageService.setInitialAppLanguage(this.language);
    }

    async presentAlert(data) {
        const alert = await this.alertController.create({
            header: 'test',
            message: data,
            buttons: ['OK']
        });
        await alert.present();
    }

    public async showOptions(ev, option) {
        // @ts-ignore
        const popover = await this.popoverController.create({
            component: ShowOptionsPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                langOptionSubject: this.langOptionSubject,
                currOptionSubject: this.currOptionSubject,
                currIconOptionSubject: this.currIconOptionSubject,
                language: this.language,
                currency: this.currency,
                currencyIcon: this.currencyIcon,
                option
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                console.log(this.langOptionSubject.value);
                if (this.langOptionSubject.value) {
                    this.language = this.langOptionSubject.value;
                }
                if (this.currOptionSubject.value) {
                    this.currency = this.currOptionSubject.value;
                    this.currencyIcon = this.currIconOptionSubject.value;
                }
            });
        return await popover.present();
    }

    onCancel($event: CustomEvent) {
        this.isSearch = false;
    }

    openSearch() {
        this.isSearch = true;
    }

    onSearch(event): void {
        const value: string = event.target.value;
        if (value) {
            this.articleService.articles = this.articleService.articles.filter((article) => {
                return article.title.toLowerCase().includes(value.toLowerCase());
            });
        }
    }

    openProfil() {
        this.navCtrl.navigateRoot('/menu/profile');
    }

    openCart() {
        this.navCtrl.navigateForward('/cart');
    }

    async showNotifcation(ev) {
        const popover = await this.popoverController.create({
            component: ShowNotificationPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {}
        });
        return await popover.present();
    }

    loadAll() {
        forkJoin(this.loadNotifMessages(), this.loadNotifLikes()).subscribe(res => {
            const msgNotifs = res[0].filter(r => r.read === false);
            const likeNotifs = res[1].filter(r => r.read === false);
            this.notif_number = msgNotifs.length + likeNotifs.length;
        });
    }

    loadNotifMessages() {
        return this.msgservice.loadReceivedMessagesNotifications(this.utilisateur._id);
    }

    loadNotifLikes() {
        return this.msgservice.loadReceivedLikesNotifications(this.utilisateur._id);
    }
}
