import {Injectable} from '@angular/core';
import {Store} from '../models/store-interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../models/environements';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    stores = [] as Store[];

    constructor(private http: HttpClient) {
        this.stores = []
    }

    loadStores(_id: string): Observable<Store[]> {
        return this.http.get<Store[]>(`${environment.api_url}/Store/user/${_id}`);
    }

    loadStore(id): Observable<Store[]> {
        return this.http.get<Store[]>(`${environment.api_url}/Store/${id}`);
    }

    addStore(store: Store) {
        return this.http.post(`${environment.api_url}/Store`, store);
    }

    updateStore(store: Store, id) {
        return this.http.put(`${environment.api_url}/Store/${id}`, store);
    }

    deleteStore(store: Store) {
        return this.http.delete(`${environment.api_url}/Store`);
    }
}
