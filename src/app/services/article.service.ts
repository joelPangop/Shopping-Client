import {Injectable} from '@angular/core';
import {Article, Availability} from '../models/article-interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../models/environements';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    article: Article;

    constructor(private http: HttpClient) {
        this.article = {} as Article;
        this.article.availability = {} as Availability;
    }

    // @ts-ignore
    loadArticle(id): Observable<Article> {
        const url = `${environment.api_url}/article/` + id;
        return this.http.get<Article>(url);
        // const xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = async () => {
        //     if (xhr.readyState === XMLHttpRequest.DONE) {
        //         // alert(xhr.responseText);
        //         console.log(JSON.parse(xhr.response));
        //         this.article = JSON.parse(xhr.response);
        //         return JSON.parse(xhr.response);
        //     }
        // };
        // xhr.open('GET', url, true);
        // xhr.send(null);
    }

    loadArticleByUser(userId): Observable<Article[]> {
        const url = `${environment.api_url}/article/user/` + userId;
        return this.http.get<Article[]>(url);
    }

    createArticle(article: Article, utilisateurId) {
        // return this.http.post(`${environment.url}/article`, article);
        // tslint:disable-next-line:max-line-length
        return this.http.post(`${environment.api_url}/article/utilisateurId/${utilisateurId}`, article, {headers: {'content-Type': 'application/json'}});
    }

    leaveNote(utilisateurId, articleId, averageStar) {
        const url = `${environment.api_url}/article/utilisateurId/${utilisateurId}/articleId/${articleId}`;
        return this.http.put(url, averageStar);
    }

    updateArticle() {
        // tslint:disable-next-line:max-line-length
        return this.http.put(`${environment.api_url}/article/` + this.article._id, this.article, {headers: {'content-Type': 'application/json'}});
    }

    deleteArticle(id: string) {
        return this.http.delete(`${environment.api_url}/article/` + id);
    }
}
