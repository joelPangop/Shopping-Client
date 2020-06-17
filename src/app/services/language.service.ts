import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Languages} from '../models/Languages';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {StorageService} from './storage.service';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    selected = '';

    constructor(private translate: TranslateService, private localStorage: StorageService, private storage: NativeStorage) {
    }

    async setInitialAppLanguage(defLanguage) {
        let language = this.translate.getBrowserLang();
        if (!defLanguage) {
            defLanguage = language;
        }

        this.translate.setDefaultLang(defLanguage);
        this.localStorage.set(LNG_KEY, defLanguage).then();
        await this.storage.setItem(LNG_KEY, defLanguage);

        this.localStorage.get(LNG_KEY).then(val => {
            if (val) {
                this.setLanguage(val);
            }
        });
    }

    getLanguages() {
        return [
          {text: Languages[Languages.EN], value: Languages.EN},
          {text: Languages[Languages.FR], value: Languages.FR}
        ];
    }

    private async setLanguage(lng) {
        this.translate.use(lng);
        this.selected = lng;
        await this.localStorage.set(LNG_KEY, lng);
        await this.storage.setItem(LNG_KEY, lng);
    }
}
