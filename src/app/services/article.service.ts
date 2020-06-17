import {Injectable} from '@angular/core';
import {Article, Availability} from '../models/article-interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../models/environements';
import {IpAddressService} from './ip-address.service';
import {ArticleStatus} from '../models/ArticleStatus';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    article: Article;
    articles: Article[];

    constructor(private http: HttpClient, public ipAddressService: IpAddressService) {
        this.article = {} as Article;
        this.article.availability = {} as Availability;
        this.articles = [] as Article[];
    }

    // @ts-ignore
    loadArticles():Observable<Article[]> {
        // // @ts-ignore
        // this.ipAddressService.networkinterface.getWiFiIPAddress((ip) => {
        //     const url = `http://${ip}:4000/article`;
        //     this.http.get<Article[]>(url).subscribe(res=>{
        //         this.articles = res;
        //         console.log(res);
        //     });
        // })

        const url = `${environment.api_url}/article`;
        return this.http.get<Article[]>(url);
    }

    loadArticle(id): Observable<Article> {
        const url = `${environment.api_url}/article/` + id;
        return this.http.get<Article>(url);
    }

    loadArticleByStore(store){
        const url = `${environment.api_url}/article/store/` + store;
        return this.http.get<Article[]>(url);
    }

    loadArticleByUser(userId): Observable<Article[]> {
        const url = `${environment.api_url}/article/user/` + userId;
        return this.http.get<Article[]>(url);
    }

    loadArticlesByCategory(catTitle: any): Observable<Article[]> {
        const url = `${environment.api_url}/article/category/` + catTitle;
        // const url = 'http://192.168.2.58:8080/article/category/' + catTitle;
        return this.http.get<Article[]>(url);
    }

    createArticle(article: Article, utilisateurId) {
        // return this.http.post(`${environment.url}/article`, article);
        // tslint:disable-next-line:max-line-length
        article.status = ArticleStatus.AVAILABLE;
        return this.http.post(`${environment.api_url}/article/utilisateurId/${utilisateurId}`, article, {headers: {'content-Type': 'application/json'}});
    }

    leaveNote(utilisateurId, articleId, averageStar) {
        const url = `${environment.api_url}/article/utilisateurId/${utilisateurId}/articleId/${articleId}`;
        return this.http.put(url, averageStar);
    }

    checkLike(utilisateurId, articleId, likes) {
        const url = `${environment.api_url}/article/like/utilisateurId/${utilisateurId}/articleId/${articleId}`;
        return this.http.put(url, likes);
    }

    updateArticle() {
        // tslint:disable-next-line:max-line-length
        return this.http.put(`${environment.api_url}/article/` + this.article._id, this.article, {headers: {'content-Type': 'application/json'}});
    }

    deleteArticle(id: string) {
        return this.http.delete(`${environment.api_url}/article/` + id);
    }
}
