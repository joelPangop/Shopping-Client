import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {ActivatedRoute} from '@angular/router';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Article} from '../../models/article-interface';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-tds-sneaker-page',
    templateUrl: './tds-sneaker-page.page.html',
    styleUrls: ['./tds-sneaker-page.page.scss'],
})
export class TdsSneakerPagePage implements OnInit {

    pages = [
        {
            title: 'MENU.categorie',
            url: '/tds-sneaker-page/all',
            icon: 'home'
        }
    ];

    filter: any;
    utilisateur = {} as Utilisateur;
    hideMenu = true;
    articles: Article[];

    constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute, private userStorageUtils: UserStorageUtils,
                private navCtrl: NavController) {
        this.articles = [];
    }

    async ngOnInit() {
        this.filter = this.activatedRoute.snapshot.paramMap.get('params');
        console.log(this.filter);
        this.utilisateur = await this.userStorageUtils.getUser();
        this.loadArticles();
    }

    loadArticles() {
        this.articleService.loadArticleByStore('TDS').subscribe(res => {
            this.articles = res;
            // this.articles = Object.values(res);
            console.log('TDS articles:', this.articles);
        });
    }

    hideShow() {
        this.hideMenu = !this.hideMenu;
    }

    showDetails(id: string) {
        this.navCtrl.navigateRoot('/product-detail/' + id);
    }

}
