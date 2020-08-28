import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Article, Availability} from '../../models/article-interface';
import {cities} from '../../models/cities';
import {categories} from '../../models/Category';
import {
    ActionSheetController,
    IonSelect,
    LoadingController, ModalController,
    NavController,
    Platform,
    PopoverController,
    ToastController
} from '@ionic/angular';

import {ImagePicker, ImagePickerOptions} from '@ionic-native/image-picker/ngx';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ImageService} from '../../services/image.service';
import {ArticleService} from '../../services/article.service';
import {Utilisateur} from '../../models/utilisateur-interface';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Store} from '../../models/store-interface';
import {StoreService} from '../../services/store.service';
import {StoreListPage} from '../store-list/store-list.page';
import {ShowCatOptionPage} from '../show-cat-option/show-cat-option.page';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {VideoMaster} from '../../models/VideoMaster';
import {SearchPage} from '../search/search.page';
import {PreviewVideoPage} from '../preview-video/preview-video.page';
import {AuthService} from '../../services/auth.service';

// const {Camera} = Plugins;

// @ts-ignore
@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.page.html',
    styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit {
    // @ts-ignore
    article: Article;
    categories: any[];
    cities;
    myPictures: any[] = [];
    uploadForm: FormGroup;
    public imagePath;
    imgURL: Map<any, any>;
    public message: string;
    utilisateur: Utilisateur;
    card: any;
    stores = [] as Store[];
    store = {} as Store;
    category = {} as any;
    firstCatChildren = {} as any;
    secondCatChildren = {} as any;
    firstCat = '' as string;
    secondCat = '' as string;
    photo: SafeResourceUrl;
    myVideos: Observable<VideoMaster[]>;
    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView: 2,
    };

    @ViewChild('videoPlayer') videoplayer: ElementRef;

    toggleVideo(event: any) {
        this.videoplayer.nativeElement.play();
    }

    @ViewChild('projectSelect', {static: false}) projectSelect: IonSelect;

    constructor(private actionSheet: ActionSheetController, private imagePicker: ImagePicker, private http: HttpClient,
                public platform: Platform, private formBuilder: FormBuilder, private imageService: ImageService,
                private toastCtrl: ToastController, private fileChooser: FileChooser, private modalController: ModalController,
                private navCtrl: NavController, private webView: WebView, public authSrv: AuthService,
                public articleService: ArticleService, public loadingCtrl: LoadingController,
                private userStorageUtils: UserStorageUtils, private popoverCtrl: PopoverController,
                private storeService: StoreService, private sanitizer: DomSanitizer) {
        this.article = {} as Article;
        this.article.availability = {} as Availability;
        this.article.pictures = [];
        this.article.averageStar = 1;
        this.article.createdAt = new Date().getTime();
        this.categories = categories;
        this.cities = cities;
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.imgURL = new Map<any, any>();
        this.myPictures = [];
    }

    async ngOnInit() {
        this.imgURL = new Map<any, any>();
        this.myPictures = [];
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.article.categories = [];
        this.utilisateur = this.authSrv.currentUser;
        this.article.owner = this.utilisateur.username;
        this.article.colors = [];
        this.article.sizes = [];
        this.platform.ready().then(() => {
            console.log(this.platform.platforms());
        });
        await this.getStores();
        const modal = document.getElementById('myModal');
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    ionViewDidEnter() {
        this.myPictures = [];
    }

    getStores() {
        this.storeService.loadStores(this.utilisateur._id).subscribe((res) => {
            this.storeService.stores = res;
        });
    }

    async setChildCat(ev, cat, cats) {
        const popover = await this.popoverCtrl.create({
            component: ShowCatOptionPage,
            event: ev,
            translucent: true,
            // cssClass: 'my-custom-dialog',
            componentProps: {
                categoryOption: cat,
                categoryOptions: cats,
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                if (cat === 'firstCatChildren') {
                    this.firstCatChildren = data.data.categoryOption;
                    this.article.categories.push(this.category.title);
                    this.article.categories.push(this.firstCatChildren.title);
                    // this.firstCat = data.data.data;
                } else if (cat === 'secondCatChildren') {
                    this.secondCatChildren = data.data.categoryOption;
                    this.article.categories.push(this.secondCatChildren.title);
                }
            });
        return await popover.present();
    }

    removeFirstChild() {
        this.category = {};
        this.firstCatChildren = {};
        this.article.categories = [];
    }

    removeSecondChild() {
        this.firstCatChildren = {};
        this.secondCatChildren = {};
    }

    compareStoreFunction(c1: Store, c2: Store): boolean {
        return c1 && c2 ? c1._id === c2._id : c1 === c2;
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

    showStore: boolean = true;

    public toggleStore() {
        this.showStore = !this.showStore;
        if (this.showStore == true) {
            this.article.store = null;
        }
    }

    async create() {
        this.article.availability.available = true;

        const loading = await this.loadingCtrl.create({
            message: 'Chargement...'
        });
        await loading.present();
        try {
            // if (this.article.availability.type === 'Livraison') {
            //     this.article.availability.address = undefined;
            // } else {
            //     this.article.availability.feed = 0;
            // }
            this.imgURL.forEach((key: any, value: any) => {
                this.myPictures.push(key);
            });
            // for(let file of this.imgURL){
            // }
            // Appeler la methode 'uploadImages'
            this.uploadForm.get('image').setValue(this.myPictures);
            // if (this.platform.is('android')) {
            //     await this.imageService.uploadMobileImage(this.myPictures).then(async res => {
            //         this.article.pictures = res;
            //         this.article.utilisateurId = this.utilisateur._id;
            //
            //         await this.articleService.createArticle(this.article, this.utilisateur._id).subscribe(res1 => {
            //             loading.dismiss();
            //             console.log(res1);
            //             this.presentToast('Création réussie !', 2000);
            //             this.navCtrl.navigateBack('/home');
            //         }, error => {
            //             loading.dismiss();
            //             this.presentToast('Echec de création !', 2000);
            //         });
            //     });
            // } else {
            await (await this.imageService.uploadImages(this.uploadForm)).subscribe(
                async (res) => {
                    console.log(res);
                    // this.myPictures.push(res.filename);
                    this.article.pictures = res.filename;
                    this.article.utilisateurId = this.utilisateur._id;
                    if(this.article.categories.includes('Voiture') || this.article.categories.includes('Moto')
                        || this.article.categories.includes('Camion')){
                        this.article.availability.type = "Main en Main";
                    }
                    await this.articleService.createArticle(this.article, this.utilisateur._id).subscribe(res1 => {
                        loading.dismiss();
                        console.log(res1);
                        this.presentToast('Création réussie !', 2000);
                        this.navCtrl.navigateRoot('/menu/tabs/products');
                    }, error => {
                        loading.dismiss();
                        this.presentToast('Echec de création !', 2000);
                    });
                },
                (err) => console.log(err)
            );
            // }
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

    async takePicture(option) {
        // // Older browsers might not implement mediaDevices at all, so we set an empty object first
        try {
            const image = await Plugins.CapacitorVideoPlayer.getPhoto({
                quality: 100,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                correctOrientation: true,
                source: CameraSource.Photos
            });
            this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
            console.log(this.photo);
            this.myPictures.push(image);
            return this.photo;
        } catch (e) {
            console.log(e);
        }
    }

    // Grace à cette methode on peut prendre en photo

    // async getCam(sourceType) {
    //     let options: CameraOptions = {
    //         sourceType: sourceType,
    //         quality: 100,
    //         destinationType: this.camera.DestinationType.DATA_URL,
    //         encodingType: this.camera.EncodingType.JPEG,
    //         mediaType: this.camera.MediaType.ALLMEDIA
    //     };
    //
    //     return this.camera.getPicture(options);
    // }
    //
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
                        this.takePicture(CameraSource.Prompt).then(image => {
                            console.log('image', image);
                            let base64Image = 'data:image/jpeg;base64,' + image;
                            // let src = this.webView.convertFileSrc(image);
                            this.myPictures.push(image);
                        });
                    }
                },
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        console.log('Camera');
                        this.takePicture(CameraSource.Camera).then(image => {
                            console.log('image', image);
                            let base64Image = 'data:image/jpeg;base64,' + image;
                            // let src = this.webView.convertFileSrc(image);
                            this.myPictures.push(image);
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
        // this.imgURL = [];
        if (event.target.files.length > 0) {
            const files: [] = event.target.files;
            // this.myPictures = files;

            for (const file of files) {
                this.preview(file);
            }
        }
    }

    async onMobileFileSelect(event) {
        if (event.target.files.length > 0) {
            const files: [] = event.target.files;
            this.myPictures = files;

            for (const file of event.target.files) {
                await this.preview(file);
            }
        }
    }

    myFiles: any[] = [];

    async preview(files) {
        const mimeType = files.type;
        if (mimeType.match(/image\/*/) == null && mimeType.match(/video\/*/) == null) {
            this.message = 'Only images or videos are supported.';
            console.log(this.message);
            this.presentToast(this.message, 2000);
            return;
        }

        // tslint:disable-next-line:prefer-const
        const reader = new FileReader();
        this.imagePath = files;
        await reader.readAsDataURL(files);
        // this.imgURL = [];
        // tslint:disable-next-line:variable-name

        if (mimeType.match(/image\/*/) !== null) {
            // reader.onload = async (_event) => {
            // tslint:disable-next-line:prefer-const
            const reader = new FileReader();
            this.imagePath = files;
            reader.readAsDataURL(files);
            // this.imgURL = [];
            // tslint:disable-next-line:variable-name
            reader.onload = (_event) => {
                this.imgURL.set(reader.result, files);
                // this.myPictures.push(reader.result);
            };
            // };
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
                        // self.imgURL.push(img.src);
                        self.imgURL.set(img.src, files);
                        // self.myPictures.push(reader.result);
                        // document.getElementById('videoId').appendChild(img);
                        // document.getElementsByTagName('div')[0].appendChild(img);
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
                // video.onClick(this.openModal(files));
                // @ts-ignore
                // document.getElementById('videoId').click(this.openModal(files));

            };
            reader.readAsArrayBuffer(files);
            this.imgURL.set(reader.result, files);
        }
        // this.myPictures.push(reader.result);
    }

    test(test: any) {
        console.log(test.target.currentSrc);
        console.log(test.target.files);
    }

    async openModal(files: any) {
        console.log(files);
        if (files.type === 'video/mp4') {
            // const modal = document.getElementById('myModal');
            // modal.style.display = 'block';
            //
            // const $source: any = document.getElementById('video_here');
            // $source.src = URL.createObjectURL(files);
            // $source.parentElement.load();
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

    showPlay(file: any): boolean {
        return file.type === 'video/mp4';
    }

    closeModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
    }

    deleteImage(key: any) {
        this.imgURL.delete(key);
        // this.imgURL.splice(i, 1);
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }

    async openStoresList(ev) {
        const popover = await this.popoverCtrl.create({
            component: StoreListPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                stores: this.storeService.stores,
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                if (data.data) {
                    console.log(data.data);
                    this.store = data.data;
                    this.article.store = this.store;
                }
            });
        return await popover.present();
    }

    deleteStore() {
        this.store = {} as Store;
    }
}
