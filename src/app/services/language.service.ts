import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';
import {Languages} from '../models/Languages';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    selected = '';

    constructor(private translate: TranslateService, private storage: Storage) {
    }

    setInitialAppLanguage(defLanguage) {
        let language = this.translate.getBrowserLang();
        if(!defLanguage){
            defLanguage = language;
        }

        this.translate.setDefaultLang(defLanguage);

        this.storage.get(LNG_KEY).then(val => {
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

    private setLanguage(lng) {
        this.translate.use(lng);
        this.selected = lng;
        this.storage.set(LNG_KEY, lng);
    }
}
