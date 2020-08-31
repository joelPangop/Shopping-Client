import {AlertController, Platform, ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Currency, Utilisateur} from '../models/utilisateur-interface';
import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Notification} from '../models/notification-interface';
import {NotificationType} from '../models/notificationType';
import {NotificationService} from './notification.service';
import {MessageService} from './message.service';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserStorageUtils {

    constructor(private platform: Platform, private localStorage: Storage, private storageService: StorageService) {
    }

    public async getUser(): Promise<Utilisateur> {
        let utilisateur = {} as Utilisateur;
        await this.storageService.getObject('Utilisateur').then(res => {
            if (res) {
                utilisateur = res as unknown as Utilisateur;
            } else {
                utilisateur = {
                    username: 'guest',
                    type: 'guest',
                    currency: {currency: 'CAD', icon: 'flag-for-flag-canada'}
                };
                this.storageService.setObject('Utilisateur', utilisateur);
            }
        }).catch((err) => {
            utilisateur = {
                username: 'guest',
                type: 'guest',
                currency: {currency: 'CAD', icon: 'flag-for-flag-canada'}
            };
            this.storageService.setObject('Utilisateur', utilisateur);
            console.log(err);
        });
        return utilisateur;
    }

    public async getLanguage() {
        let language: any;
        language = await this.storageService.getObject('SELECTED_LANGUAGE');
        return language;
    }

    public async getCurrency(): Promise<Currency> {
        let currency = {} as Currency;
        // currency = await this.localStorage.get('currency');
        await this.storageService.getObject('currency').then(res => {
            currency = res as unknown as Currency;
        }).catch((err) => {
            console.log(err);
        });
        return currency;
    }

}
