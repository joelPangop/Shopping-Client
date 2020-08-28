import {Component, OnInit} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Utilisateur} from '../../models/utilisateur-interface';
import {UserStorageUtils} from '../../services/UserStorageUtils';
import {AuthService} from '../../services/auth.service';
import {MessageService} from '../../services/message.service';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

    utilisateur = {} as Utilisateur;

    constructor(private menuController: MenuController, private userStorageUtils: UserStorageUtils,
                public authService: AuthService, public messageService: MessageService) {
        this.menuController.enable(true); // Enable side menu
        this.userStorageUtils.getUser().then(res => {
            this.utilisateur = res as Utilisateur;
        });
    }

    async ngOnInit() {
        this.messageService.loadAllNotifications(this.authService.currentUser._id).subscribe((res) => {
            console.log(res);
            this.messageService.setNotificationCount(res.length);
        });
    }

}
