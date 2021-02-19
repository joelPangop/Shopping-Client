import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ArticleService} from '../../services/article.service';
import {AuthService} from '../../services/auth.service';
import {ImageService} from '../../services/image.service';
import {LoadingController, NavController, NavParams, Platform, PopoverController, ToastController} from '@ionic/angular';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {Utilisateur} from '../../models/utilisateur-interface';

@Component({
    selector: 'app-view-profile',
    templateUrl: './view-profile.page.html',
    styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {

    utilisateur = {} as Utilisateur;
    imgURL: any;

    constructor(private popoverController: PopoverController, public navParams: NavParams,
                private navCtrl: NavController, private userStorageUtils: UserStorageUtils) {
    }

    async ngOnInit() {
        this.utilisateur = await this.userStorageUtils.getUser();
        console.log('utilisateur', this.utilisateur);
        this.imgURL = !this.utilisateur.avatar ? 'assets/profile_img.svg' : 'https://egoal.herokuapp.com/image/' + this.utilisateur.avatar;
    }

    openProfil() {
        this.navCtrl.navigateRoot('/menu/profile');
        const popover = this.navParams.get('popover');
        popover.dismiss();
    }


}
