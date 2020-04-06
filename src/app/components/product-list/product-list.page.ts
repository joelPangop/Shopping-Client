import {Component, OnInit} from '@angular/core';
import {Article} from '../../models/article-interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {Utilisateur} from '../../models/utilisateur-interface';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Socket} from 'ngx-socket-io';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {Events, NavController} from '@ionic/angular';
import {MessageService} from '../../services/message.service';
import {Network} from '@ionic-native/network/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {ArticleService} from '../../services/article.service';
import {environment} from '../../models/environements';
import {itemCart} from '../../models/itemCart-interface';
import {CurrencyService} from '../../services/currency.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.page.html',
    styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

    nom: string;
    description: string;
    articles: Article[];
    public cartItemCount = new BehaviorSubject(0);
    utilisateur = {} as Utilisateur;
    notifications = [];
    ip;
    slideOpts = {
        speed: 1000,
        autoplay: {
            delay: 500
        }
    };
    resultRate = '1.0';

    constructor(private http: HttpClient, private router: Router, private storage: NativeStorage,
                private socket: Socket, private photoViewer: PhotoViewer, private navCtrl: NavController,
                private msgService: MessageService, public network: Network, public dialog: Dialogs,
                private articleService: ArticleService, protected cuService: CurrencyService,
                private event: Events) {
        this.event.subscribe('rate', (rate) => {
            this.resultRate = rate;
            for (let article of this.articleService.articles) {
                article.price = article.price * parseFloat(this.resultRate);
                console.log(article.price);
            }
        });
    }

    async ngOnInit() {
        this.socket.connect();
        this.utilisateur = await this.storage.getItem('Utilisateur');
        await this.loadArticles();
        this.ip = environment.api_url;
        await this.storage.getItem('cart').then(res => {
            const rep = res as itemCart[];
            this.cartItemCount.next(rep.length);
        });
        // this.resultRate = this.cuService.currRateOptionSubject.value;
    }

    // @ts-ignore
    loadArticles() {
        this.articleService.loadArticles()
            .subscribe((articles: Article[]) => {
                this.articleService.articles = articles;
                console.log('Articles', articles);
            });
    }

    insererArticle(): void {
        const url = `${environment.api_url}/article`;
        this.http.post(url, {nom: this.nom, description: this.description}).subscribe(res => console.log('res', res));
    }

    updateArticle(): void {
        const url = `${environment.api_url}/article`;
        this.http.put(url, {nom: this.nom, description: this.description}).subscribe(res => console.log('res', res));
    }

    doRefresh($event) {
        this.loadArticles();
        $event.target.complete();
        //     .subscribe((articles: Article[]) => {
        //     this.articles = articles;
        //     console.log('Articles a partir du panier', articles);
        //     $event.target.complete();
        // });
    }

    showImage(imgId: string, title: string, event) {
        event.stopPropagation();
        this.photoViewer.show(`${environment.api_url}/image/${imgId}`, title, {share: true});
    }

    showDetails(id: string) {
        this.navCtrl.navigateForward('/product-detail/' + id);
    }

    goToCreate() {
        this.navCtrl.navigateForward('/create-product');
    }

    onSearch(event): void {
        const value: string = event.target.value;
        if (value) {
            this.articleService.articles = this.articles.filter((article) => {
                return article.title.toLowerCase().includes(value.toLowerCase());
            });
        }
    }

    onCancel(e) {
        this.loadArticles();
    }

    async openCart() {
        await this.storage.setItem('page', 'home');
        await this.navCtrl.navigateForward('/cart');
    }

    showOptions($event: MouseEvent, language: string) {

    }

    loadReceivedNotifications() {
        this.msgService.loadReceivedNotifications(this.utilisateur._id).subscribe(res => {
            this.notifications = res;
        });
    }

}
