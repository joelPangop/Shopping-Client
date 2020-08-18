import {Component, OnInit} from '@angular/core';
import {Article} from '../../models/article-interface';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {AlertController, LoadingController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {ImageService} from '../../services/image.service';
import {ArticleService} from '../../services/article.service';
import {Observable} from 'rxjs';
import {cities} from '../../models/cities';
import {categories} from '../../models/Category';
import {PreviewVideoPage} from '../preview-video/preview-video.page';
import {environment} from '../../models/environements';
import {AuthService} from '../../services/auth.service';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.page.html',
    styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
    id;
    article = {} as Article;
    myPictures: any[] = [];
    uploadForm: FormGroup;
    public imagePath;
    imgURL: Map<any, any>;
    categories;
    cities;
    returnPage: string;
    public message: string;
    slideOpts = {
        speed: 1000,
        slidesPerView: 1,
        zoom: {
            maxRatio: 5,
        },
        spaceBetween: 25,
        autoplay: {
            delay: 4000
        }
    };
    page: string = '';

    constructor(private activatedRoute: ActivatedRoute, private photoViewer: PhotoViewer, private navCtrl: NavController,
                private imageService: ImageService, private formBuilder: FormBuilder, private loadingCtrl: LoadingController,
                private toastCtrl: ToastController, public platform: Platform, public articleService: ArticleService,
                public modalController: ModalController, private authService: AuthService, private alertController: AlertController,
                private storage: StorageService, private router: Router) {
        this.categories = categories;
        this.cities = cities;
        this.myPictures = [];

    }

    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.imgURL = new Map<any, any>();
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.loadData();
    }

    // async ionViewWillEnter() {
    //     this.id = this.activatedRoute.snapshot.paramMap.get('id');
    //     await this.loadData();
    // }

    // async ionViewDidEnter() {
    //     this.id = this.activatedRoute.snapshot.paramMap.get('id');
    //     // this.loadData();
    // }

    // @ts-ignore
    loadData() {
        this.articleService.loadArticle(this.id).subscribe((res) => {
            this.article = res as Article;
        });
    }

    async goBack() {
        await this.navCtrl.navigateBack([this.page]);
    }

    async showImage(imgId: string, imgTitle: string) {
        if (imgId.includes('jpg') || imgId.includes('jfif') || imgId.includes('png')) {
            if (this.platform.is('android') || this.platform.is('ios')) {
                this.photoViewer.show(`${environment.api_url}/image/${imgId}`,
                    imgTitle, {share: true});
            } else if (this.platform.is('desktop') || this.platform.is('hybrid')) {
                console.log('platform', this.platform.platforms());
            }
        }
    }

    isImage(img: string): boolean {
        return img.includes('jpg') || img.includes('jpeg') || img.includes('png') || img.includes('jfif');
    }

    onFileSelect(event) {
        // this.imgURL = [];
        if (event.target.files.length > 0) {
            const files: [] = event.target.files;
            // this.myPictures = files;

            for (const file of files) {
                this.preview(file);
            }
        }
    }

    async preview(files) {
        const mimeType = files.type;
        if (mimeType.match(/image\/*/) == null && mimeType.match(/video\/*/) == null) {
            this.message = 'Only images or videos are supported.';
            console.log(this.message);
            this.presentToast(this.message, 2000);
            return;
        }

        const reader = new FileReader();
        this.imagePath = files;
        await reader.readAsDataURL(files);

        if (mimeType.match(/image\/*/) !== null) {
            const reader = new FileReader();
            this.imagePath = files;
            reader.readAsDataURL(files);
            reader.onload = (_event) => {
                this.imgURL.set(reader.result, files);
            };
        }
        if (mimeType.match(/video\/*/) !== null) {
            const self = this;
            reader.onload = async (_event) => {
                const snapImage = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    const image = canvas.toDataURL();
                    const success = image.length > 100000;
                    if (success) {
                        const img = document.createElement('img');
                        img.src = image;
                        self.imgURL.set(img.src, files);
                        URL.revokeObjectURL(url);
                    }
                    return success;
                };
                const blob = new Blob([reader.result], {type: files.type});
                const url = URL.createObjectURL(files);
                const video: any = document.createElement('video');

                const timeupdate = function() {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                        video.pause();
                    }
                };
                video.addEventListener('loadeddata', function() {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                    }
                });
                video.addEventListener('timeupdate', timeupdate);
                let source = document.createElement('source');
                source.src = URL.createObjectURL(files);
                video.appendChild(source);

                const controls = document.createAttribute('controls');
                video.preload = 'metadata';
                // source.src = url;
                video.src = url;

                video.setAttributeNode(controls);
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;
                video.load();

                await video.play();

            };
            reader.readAsArrayBuffer(files);
            this.imgURL.set(reader.result, files);
        }
    }

    showPlay(file: any): boolean {
        return file.type === 'video/mp4';
    }

    async openModal(files: any) {
        console.log(files);
        if (files.type === 'video/mp4') {
            const modal = await this.modalController.create({
                component: PreviewVideoPage,
                cssClass: 'cart-modal',
                componentProps: {
                    files: files,
                }
            });
            return await modal.present();
        }
    }

    deleteImage(key: any) {
        this.imgURL.delete(key);
    }

    async update() {
        this.articleService.article = this.article;
        const loading = await this.loadingCtrl.create({
            message: 'Chargement...'
        });
        await loading.present();
        try {
            this.imgURL.forEach((key: any, value: any) => {
                this.myPictures.push(key);
            });
            this.uploadForm.get('image').setValue(this.myPictures);

            await (await this.imageService.uploadImages(this.uploadForm)).subscribe(
                async (res) => {
                    for (let img of res.filename as []) {
                        this.article.pictures.push(img);
                    }
                    this.article.utilisateurId = this.authService.currentUser._id;
                    this.articleService.updateArticle().subscribe(res => {
                        loading.dismiss();
                        console.log(res);
                        this.imgURL = new Map<any, any>();
                        this.myPictures = [];
                        this.presentToast('Mise a jour reussite', 2000);
                        this.navCtrl.navigateBack('/profile');
                    }, error => {
                        loading.dismiss();
                        this.presentToast('Echec de la mise a jour', 2000);
                        console.log('error', error);
                    });
                }
            );
        } catch (e) {
            await loading.dismiss();
            console.log('error', e);
        }
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }

    color = '' as string;

    addColor() {
        if (this.color) {
            this.article.colors.push(this.color);
            this.color = '';
        }
    }

    size = '' as string;

    addSize() {
        if (this.size) {
            this.article.sizes.push(this.size);
            this.size = '';
        }
    }

    removeColor(index) {
        if (this.article.colors.length > 0) {
            this.article.colors.splice(index, 1);
        }
    }

    removeSize(index) {
        if (this.article.sizes.length > 0) {
            this.article.sizes.splice(index, 1);
        }
    }

    removeArticleImage(file, index) {
        this.imageService.deleteImage(file).subscribe((res: any) => {
            if (res.res === 'success') {
                this.article.pictures.splice(index, 1);
                this.articleService.article = this.article;
                this.articleService.updateArticle().subscribe((res) => {
                    console.log(res);
                });
            }
        });
    }

    async presentAlertConfirm(file, index) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm!',
            message: 'Message <strong>text</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.removeArticleImage(file, index);
                        console.log('Confirm Okay');
                    }
                }
            ]
        });
        await alert.present();
    }
}
