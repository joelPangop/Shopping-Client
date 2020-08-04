import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    selected = '';

    constructor(private translate: TranslateService, private storage: Storage) {
        translate.addLangs(['en', 'fr']);
    }

    setInitialAppLanguage() {
        // let language = this.translate.getBrowserLang();
        this.translate.setDefaultLang('en');

        this.storage.get(LNG_KEY).then(value => {
            if (value) {
                this.setLanguage(value);
                this.selected = value;
            }
        });
    }

    getLanguages(): any {
        return [
            {text: 'English', value: 'en', img: 'assets/icon/flag-gb.png'},
            {text: 'French', value: 'fr', img: 'assets/icon/France-Flag.png'}
        ];
    }

    public setLanguage(value: any) {
        this.translate.setDefaultLang(value);
        this.translate.use(value);
        this.selected = value;
        this.storage.set(LNG_KEY, value);
    }
}
