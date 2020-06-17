import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Article} from '../models/article-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {itemCart} from '../models/itemCart-interface';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(public storage: Storage, private nativeStorage: NativeStorage) {
        console.log('Your storage provider is working here !');
    }

// set a key/value
    public async set(key: string, value: any): Promise<any> {
        try {
            const result = await this.storage.set(key, value);
            console.log('set string in storage: ' + result);
            return true;
        } catch (reason) {
            console.log(reason);
            return false;
        }
    }

// to get a key/value pair
    public async get(key: string): Promise<any> {
        try {
            const result = await this.storage.get(key);
            console.log('storageGET: ' + key + ': ' + result);
            if (result != null) {
                return result;
            }
            return null;
        } catch (reason) {
            console.log(reason);
            return null;
        }
    }

// set a key/value object
    public async setObject(key: string, object: Object) {
        try {
            const result = await this.storage.set(key, JSON.stringify(object));
            console.log('set Object in storage: ' + result);
            return true;
        } catch (reason) {
            console.log(reason);
            return false;
        }
    }

// get a key/value object
    public async getObject(key: string): Promise<any> {
        try {
            const result = await this.storage.get(key);
            if (result != null) {
                return JSON.parse(result);
            }
            return null;
        } catch (reason) {
            console.log(reason);
            return null;
        }
    }

// remove a single key value:
    public remove(key: string) {
        this.storage.remove(key);
    }

//  delete all data from your application:
    public clear() {
        this.storage.clear();
    }

    getStorage(ITEMS_KEY): Promise<Article[]> {
        return this.storage.get(ITEMS_KEY);
    }

    setStorageValue(product: itemCart, ITEMS_KEY): Promise<any> {
        return this.storage.get(ITEMS_KEY).then((items: itemCart[]) => {
            if (items) {
                items.push(product);
                return this.storage.set(ITEMS_KEY, items);
            } else {
                return this.storage.set(ITEMS_KEY, product as itemCart);
            }
        });
    }

    updateStorageValue(item: itemCart, ITEMS_KEY): Promise<any> {
        return this.storage.get(ITEMS_KEY).then((items: Article[]) => {
            if (!items || items.length === 0) {
                return null;
            }

            let newItems: Article[] = [];

            for (let i of items) {
                if (i._id === item.item._id) {
                    newItems.push(item.item);
                } else {
                    newItems.push(i);
                }
            }

            return this.storage.set(ITEMS_KEY, newItems);
        });
    }

    removeStorageValue(id: string, ITEMS_KEY): Promise<itemCart> {
        return this.storage.get(ITEMS_KEY).then((items: itemCart[]) => {
            if (!items || items.length === 0) {
                return null;
            }
            const toKeep: itemCart[] = [];

            for (let i of items) {
                if (i.item._id !== id) {
                    toKeep.push(i);
                }
            }
            return this.storage.set(ITEMS_KEY, toKeep);
        });
    }
}
