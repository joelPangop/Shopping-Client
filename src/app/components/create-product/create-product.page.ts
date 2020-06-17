import {Component, OnInit, ViewChild} from '@angular/core';
import {Article, Availability} from '../../models/article-interface';
import {cities} from '../../models/cities';
import {categories} from '../../models/Category';
import {
    ActionSheetController,
    IonSelect,
    LoadingController,
    NavController,
    Platform,
    PopoverController,
    ToastController
} from '@ionic/angular';

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
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Store} from '../../models/store-interface';
import {StoreService} from '../../services/store.service';
import {environment} from '../../models/environements';
import {StoreListPage} from '../store-list/store-list.page';
import {ShowCatOptionPage} from '../show-cat-option/show-cat-option.page';

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
    categories: any[];
    cities;
    myPictures: any[] = [];
    uploadForm: FormGroup;
    public imagePath;
    imgURL: any[] = [];
    public message: string;
    utilisateur: Utilisateur;
    card: any;
    stores = [] as Store[];
    store = {} as Store;
    public ip: string;
    category = {} as any;
    firstCatChildren = {} as any;
    secondCatChildren = {} as any;
    firstCat = '' as string;
    secondCat = '' as string;

    @ViewChild('projectSelect', {static: false}) projectSelect: IonSelect;

    constructor(private actionSheet: ActionSheetController, private imagePicker: ImagePicker, private http: HttpClient,
                public platform: Platform, private formBuilder: FormBuilder, private imageService: ImageService,
                private camera: Camera, private toastCtrl: ToastController, private fileChooser: FileChooser,
                public storage: NativeStorage, private navCtrl: NavController, private webView: WebView,
                public articleService: ArticleService, public loadingCtrl: LoadingController,
                private userStorageUtils: UserStorageUtils, private popoverCtrl: PopoverController,
                private storeService: StoreService) {
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
        this.imgURL = [];
    }

    async ngOnInit() {
        test();
        this.imgURL = [];
        this.ip = environment.api_url;
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
        this.article.categories = [];
        this.utilisateur = await this.userStorageUtils.getUser();
        this.article.owner = this.utilisateur.username;
        this.article.colors = [];
        this.article.sizes = [];
        this.platform.ready().then(() => {
            console.log(this.platform.platforms());
        });
        await this.getStores();
        console.log('form', document.getElementById('testId'));
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
        this.article.colors.push(this.color);
        this.color = '';
    }

    size = '' as string;
    addSize(){
        this.article.sizes.push(this.size);
        this.size = '';
    }

    removeColor(index){
        if(this.article.colors.length > 0){
            this.article.colors.splice(index, 1);
        }
    }

    removeSize(index){
        if(this.article.sizes.length > 0){
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
            if (this.article.availability.type === 'Livraison') {
                this.article.availability.address = undefined;
            } else {
                this.article.availability.feed = 0;
            }
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
                    await this.articleService.createArticle(this.article, this.utilisateur._id).subscribe(res1 => {
                        loading.dismiss();
                        console.log(res1);
                        this.presentToast('Création réussie !', 2000);
                        this.navCtrl.navigateRoot('/tabs/products');
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
                            this.myPictures.push(base64Image);
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
