import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../models/environements';
import {Router} from '@angular/router';
import {Article} from '../models/article-interface';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {BehaviorSubject, Observable} from 'rxjs';
import {NavController} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {itemCart} from '../models/itemCart-interface';
import {Socket} from 'ngx-socket-io';
import {MessageService} from '../services/message.service';
import {Utilisateur} from '../models/utilisateur-interface';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    nom: string;
    description: string;
    articles: Article[];
    public cartItemCount = new BehaviorSubject(0);
    utilisateur = {} as Utilisateur;
    notifications = [];

    constructor(private http: HttpClient, private router: Router, private storage: NativeStorage,
                private socket: Socket, private photoViewer: PhotoViewer, private navCtrl: NavController,
                private msgService: MessageService) {
    }

    async ngOnInit() {
        this.socket.connect();
        this.utilisateur = await this.storage.getItem('Utilisateur');
        await this.loadArticles()
            .subscribe((articles: Article[]) => {
                this.articles = articles;
                for (let i = 0; i < 5; i++) {
                    this.articles.push(...articles);
                }
                console.log('Articles', articles);
            });
        await this.storage.getItem('cart').then(res => {
            const rep = res as itemCart[];
            this.cartItemCount.next(rep.length);
        });
    }

    // @ts-ignore
    loadArticles(): Observable<Article[]> {
        const url = `${environment.api_url}/article`;
        return this.http.get<Article[]>(url);
        // const xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === XMLHttpRequest.DONE) {
        //         // alert(xhr.responseText);
        //         // console.log(JSON.parse(xhr.responseText));
        //         this.articles = JSON.parse(xhr.response);
        //         return JSON.parse(xhr.response);
        //     }
        // };
        // xhr.open('GET', url, true);
        // xhr.send(null);
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
        this.photoViewer.show('https://mysite.com/path/to/image.jpg', title, {share: true});
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
            this.articles = this.articles.filter((article) => {
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
