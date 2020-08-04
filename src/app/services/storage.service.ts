import {Injectable} from '@angular/core';
// import {Storage} from '@ionic/storage';
import {Article} from '../models/article-interface';
import {itemCart} from '../models/itemCart-interface';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() {
        console.log('Your storage provider is working here !');
    }

    async setString(key: string, value: string) {
        await Storage.set({ key, value });
    }

    async getString(key: string): Promise<{ value: any }> {
        return (await Storage.get({ key }));
    }

    async setObject(key: string, value: any) {
        await Storage.set({ key, value: JSON.stringify(value) });
    }

    async getObject(key: string): Promise<{ value: any }> {
        const ret = await Storage.get({ key });
        return JSON.parse(ret.value);
    }


    async removeItem(key: string) {
        await Storage.remove({ key });
    }

    async clear() {
        await Storage.clear();
    }
}
