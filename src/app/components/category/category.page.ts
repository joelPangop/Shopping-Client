import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Article} from '../../models/article-interface';
import {Observable} from 'rxjs';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {NavController, ToastController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../models/environements';

@Component({
    selector: 'app-category',
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

    catTitle: string;
    articles: Article[];

    constructor(private activatedRoute: ActivatedRoute, private toastCtrl: ToastController, private http: HttpClient,
                private photoViewer: PhotoViewer, private navCtrl: NavController) {
    }

    ngOnInit() {
        this.catTitle = this.activatedRoute.snapshot.paramMap.get('catTitle');
        this.loadArticles().subscribe(data => {
            this.articles = data;
        });
    }

    // @ts-ignore
    loadArticles(): Observable<Article[]> {
        const url = `${environment.api_url}/article/category/` + this.catTitle;
        return this.http.get<Article[]>(url);
        // const xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === XMLHttpRequest.DONE) {
        //         // alert(xhr.responseText);
        //         // console.log(JSON.parse(xhr.responseText));
        //         this.articles = JSON.parse(xhr.response);
        //         if (this.articles.length === 0) {
        //             this.presentToast('Pas d\'article pour cette categorie pour le moment', 2000);
        //         }
        //         return JSON.parse(xhr.response);
        //     }
        // };
        // xhr.open('GET', url, true);
        // xhr.send(null);
    }

    doRefresh($event) {
        this.loadArticles().subscribe((articles: Article[]) => {
            this.articles = articles;
            console.log('Articles a partir du panier', articles);
            $event.target.complete();
        });
    }

    showImage(imgId: string, title: string, event) {
        event.stopPropagation();
        this.photoViewer.show('https://mysite.com/path/to/image.jpg', title, {share: true});
    }

    showDetails(id: string) {
        this.navCtrl.navigateForward('/product-detail/' + id);
    }

    async presentToast(msg: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration
        });
        toast.present();
    }
}
