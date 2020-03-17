import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Article, Availability} from '../../models/article-interface';
import {cities} from '../../models/cities';
import {categories} from '../../models/Category';
import {ActionSheetController, LoadingController, NavController, Platform, ToastController} from '@ionic/angular';

import {ImagePicker, ImagePickerOptions} from '@ionic-native/image-picker/ngx';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {HttpClient} from '@angular/common/http';
import {ImageService} from '../../services/image.service';
import {ArticleService} from '../../services/article.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';

declare function test(): void;

// @ts-ignore
@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.page.html',
    styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit {
    // @ts-ignore
    article: Article;
    categories;
    cities;
    myPictures: any[] = [];
    uploadForm: FormGroup;
    public imagePath;
    imgURL: any[] = [];
    public message: string;
    utilisateur: Utilisateur;
    card: any;

    constructor(private actionSheet: ActionSheetController, private imagePicker: ImagePicker, private http: HttpClient,
                public platform: Platform, private formBuilder: FormBuilder, private imageService: ImageService,
                private camera: Camera, private toastCtrl: ToastController, private fileChooser: FileChooser,
                public storage: NativeStorage, private navCtrl: NavController, private webView: WebView,
                public articleService: ArticleService, public loadingCtrl: LoadingController) {
        this.article = {} as Article;
        this.article.availability = {} as Availability;
        this.article.pictures = [];
        this.article.averageStar = 1;
        this.article.createdAt = new Date().getTime();
        this.categories = categories;
        this.cities = cities;
    }

    async ngOnInit() {
        test();
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.utilisateur = await this.storage.getItem('Utilisateur');
        this.article.owner = this.utilisateur.username;
        this.platform.ready().then(() => {
            console.log(this.platform.platforms());
        });

        console.log('form', document.getElementById('testId'));
    }

    async create() {
        this.article.availability.available = true;
        const loading = await this.loadingCtrl.create({
            message: 'Chargement...'
        });
        await loading.present();
        try {
            if (this.article.availability.type === 'Livraison') {
                this.article.availability.address = undefined;
            } else {
                this.article.availability.feed = 0;
            }
            // Appeler la methode 'uploadImages'
            console.log(this.storage.getItem('images'));
            this.uploadForm.get('image').setValue(this.myPictures);
            if (this.platform.is('android')) {
                await this.imageService.uploadMobileImage(this.myPictures).then(async res => {
                    this.article.pictures = res;
                    this.article.utilisateurId = this.utilisateur._id;

                    await this.articleService.createArticle(this.article, this.utilisateur._id).subscribe(res1 => {
                        loading.dismiss();
                        console.log(res1);
                        this.presentToast('Création réussie !', 2000);
                        this.navCtrl.navigateBack('/home');
                    }, error => {
                        loading.dismiss();
                        this.presentToast('Echec de création !', 2000);
                    });
                });
            } else {
                await (await this.imageService.uploadImages(this.uploadForm)).subscribe(
                    async (res) => {
                        console.log(res);
                        // this.myPictures.push(res.filename);
                        this.article.pictures = res.filename;
                        this.article.utilisateurId = this.utilisateur._id;
                        await this.articleService.createArticle(this.article, this.utilisateur._id).subscribe(res1 => {
                            loading.dismiss();
                            console.log(res1);
                            this.presentToast('Création réussie !', 2000);
                            this.navCtrl.navigateBack('/home');
                        }, error => {
                            loading.dismiss();
                            this.presentToast('Echec de création !', 2000);
                        });
                    },
                    (err) => console.log(err)
                );
            }
        } catch (e) {
            await loading.dismiss();
            console.log('error', e);
        }
    }

    // Grace à cette methode on selectionne les images à partir de la galerie
    async galerie(imageNum: number) {
        let options: ImagePickerOptions = {
            maximumImagesCount: imageNum,
            outputType: 0
        };
        return this.imagePicker.getPictures(options);
    }

    // Grace à cette methode on peut prendre en photo
    async getCam(sourceType) {
        let options: CameraOptions = {
            sourceType: sourceType,
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.ALLMEDIA
        };

        return this.camera.getPicture(options);
    }

    async action() {
        const actionSheet = await this.actionSheet.create({
            header: 'Sélectionner la source',
            buttons: [
                {
                    text: 'Galerie',
                    icon: 'images',
                    handler: async () => {
                        console.log('Galerie');
                        const file = document.getElementsByClassName('cordova-camera-select');
                        // console.log(this.platform.is(PLATFORMS_MAP.mobileweb));
                        this.getCam(0).then(image => {
                            console.log('image', image);
                            let base64Image = 'data:image/jpeg;base64,' + image;
                            let src = this.webView.convertFileSrc(image);
                            this.myPictures.push(src);
                        });

                    }
                },
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        console.log('Camera');
                        this.getCam(1).then(image => {
                            console.log('image', image);
                            let base64Image = 'data:image/jpeg;base64,' + image;
                            let src = this.webView.convertFileSrc(image);
                            this.myPictures.push(base64Image);
                        });
                    }
                },
                {
                    text: 'Annuler',
                    icon: 'Close',
                    role: 'Cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    onFileSelect(event) {
        this.imgURL = [];
        if (event.target.files.length > 0) {
            const files: [] = event.target.files;
            this.myPictures = files;

            for (const file of files) {
                this.preview(file);
            }
        }
    }

    preview(files) {
        const mimeType = files.type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = 'Only images are supported.';
            return;
        }

        // tslint:disable-next-line:prefer-const
        const reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files);
        this.imgURL = [];
        // tslint:disable-next-line:variable-name
        reader.onload = (_event) => {
            this.imgURL.push(reader.result);
            this.myPictures.push(reader.result);
        };
    }

    deleteImage(i: number) {
        this.imgURL.splice(i, 1);
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }
}
