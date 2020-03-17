import {Component, OnInit} from '@angular/core';
import {Article} from '../../models/article-interface';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ImageService} from '../../services/image.service';
import {ArticleService} from '../../services/article.service';
import {Observable} from 'rxjs';
import {cities} from '../../models/cities';
import {categories} from '../../models/Category';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.page.html',
    styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
    id;
    article = {} as Article;
    uploadForm: FormGroup;
    images: any;
    categories;
    cities;
    returnPage: string;

    constructor(private activatedRoute: ActivatedRoute, private photoViewer: PhotoViewer, private navCtrl: NavController,
                private storage: NativeStorage, private imageService: ImageService,
                private toastCtrl: ToastController, public platform: Platform, public articleService: ArticleService,
                public modalController: ModalController) {
        this.categories = categories;
        this.cities = cities;
    }

    async ngOnInit() {
        this.returnPage = await this.storage.getItem('page');
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        await this.loadData();
    }

    // @ts-ignore
    loadData(): Observable<Article> {
        this.articleService.loadArticle(this.id).subscribe(res => {
            this.articleService.article = res as Article;
            this.images = this.articleService.article.pictures;
            // this.rate = this.articleService.article.averageStar;
        });
    }

    update() {
        this.articleService.updateArticle().subscribe(res => {
            this.presentToast('Mise a jour reussite', 2000);
            this.navCtrl.navigateBack('/profile');
        }, error => {
            this.presentToast('Echec de la mise a jour', 2000);
            console.log('error', error);
        });
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }

}
