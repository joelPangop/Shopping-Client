import {Platform} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Storage} from '@ionic/storage';
import {Utilisateur} from '../models/utilisateur-interface';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserStorageUtils {
    constructor(private platform: Platform, private storage: NativeStorage,
                private localStorage: Storage) {
    }

    public async getUser() {
        let utilisateur = {} as Utilisateur;
        if (this.platform.is('ios') || this.platform.is('android')) {
            await this.storage.getItem('Utilisateur').then(res => {
                utilisateur = res as Utilisateur;
            }).catch((err) => {
                utilisateur = {
                    username: 'guest',
                    type: 'guest'
                };
                this.storage.setItem('Utilisateur', utilisateur);
                console.log(err);
            });
        } else if (!this.platform.is('ios') && !this.platform.is('android')) {
            await this.localStorage.get('Utilisateur').then(res => {
                if (res) {
                    utilisateur = res as Utilisateur;
                } else {
                    utilisateur = {
                        username: 'guest',
                        type: 'guest'
                    };
                    this.localStorage.set('Utilisateur', utilisateur);
                }
            }).catch((err) => {
                utilisateur = {
                    username: 'guest',
                    type: 'guest'
                };
                this.localStorage.set('Utilisateur', utilisateur);
                console.log(err);
            });
        }
        return utilisateur;
    }

    public async getLanguage() {
        let language: any;
        if (this.platform.is('ios') || this.platform.is('android')) {
            language = await this.storage.getItem('SELECTED_LANGUAGE');
        } else if (!this.platform.is('ios') && !this.platform.is('android')) {
            language = await this.localStorage.get('SELECTED_LANGUAGE');
        }
        return language;
    }

    public async getCurrency() {
        let currency: any;
        if (this.platform.is('ios') || this.platform.is('android')) {
            currency = await this.storage.getItem('currency');
        } else if (!this.platform.is('ios') && !this.platform.is('android')) {
            currency = await this.localStorage.get('currency');
        }
        return currency;
    }
}
