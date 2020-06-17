import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '../../models/store-interface';
import {ImageService} from '../../services/image.service';
import {StoreService} from '../../services/store.service';
import {ToastController} from '@ionic/angular';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Utilisateur} from '../../models/utilisateur-interface';

@Component({
    selector: 'app-store',
    templateUrl: './store.page.html',
    styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {
    uploadForm: FormGroup;
    store = {} as Store;
    image: any;
    imgURL: any;
    private message: string;
    utilisateur: Utilisateur

    constructor(public formBuilder: FormBuilder, private imgSrv: ImageService, private storeService: StoreService,
                private toastCtrl: ToastController, private userStorageUtils: UserStorageUtils) {
        this.uploadForm = this.formBuilder.group({
            image: ['']
        });
    }

    async ngOnInit() {
      this.utilisateur = await this.userStorageUtils.getUser();
    }

    onFileSelect(event) {
        this.imgURL = [];
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.image = file;
            this.preview(file);
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
        // this.imagePath = files;
        reader.readAsDataURL(files);
        // tslint:disable-next-line:variable-name
        reader.onload = (_event) => {
            this.imgURL = reader.result;
        };
    }

    async create() {
        this.uploadForm.get('image').setValue(this.image);
        await this.imgSrv.uploadImage(this.uploadForm).subscribe(async res => {
            if (res) {
                this.store.image = res.filename;
                this.store.user = this.utilisateur._id;
                this.storeService.addStore(this.store).subscribe(res => {
                    this.presentToast('Store added', 2000);
                });
            }
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
