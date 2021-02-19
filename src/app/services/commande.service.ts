import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Commande} from '../models/commande-interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../models/environements';
import {Utilisateur} from '../models/utilisateur-interface';
import {itemCart} from '../models/itemCart-interface';

@Injectable({
    providedIn: 'root'
})
export class CommandeService {

    commande = {} as Commande;
    received_orders = [] as itemCart[];
    public cartItemCount = new BehaviorSubject(0);

    constructor(private http: HttpClient) {
        this.commande = {} as Commande;
        this.received_orders = [] as itemCart[];
    }

    createCommande(): Observable<Commande> {
        return this.http.post<Commande>(`${environment.api_url}/commande`, this.commande);
    }

    updateCommande(): Observable<any> {
        return this.http.put<any>(`${environment.api_url}/commande/${this.commande._id}`, this.commande);
    }

    update(commande: Commande): Observable<any> {
        return this.http.put<any>(`${environment.api_url}/commande/${commande._id}`, commande);
    }

    deleteCommande(): Observable<Commande> {
        return this.http.delete<Commande>(`${environment.api_url}/commande/${this.commande._id}`);
    }

    loadCommande(user: Utilisateur): Observable<Commande> {
        return this.http.get<Commande>(`${environment.api_url}/commande/${user._id}`);
    }

    loadCheckoutCommande(user: Utilisateur): Observable<Commande> {
        return this.http.get<Commande>(`${environment.api_url}/commande/checkout/${user._id}`);
    }

    getAll(user: Utilisateur): Observable<Commande[]> {
        return this.http.get<Commande[]>(`${environment.api_url}/commande/all/${user._id}`);
    }

    getCmdByItem(item: string){
        return this.http.get<Commande>(`${environment.api_url}/commande/item/${item}`);
    }

    getCmdByItems(ids: string[]){
        return this.http.get<Commande>(`${environment.api_url}/commande/item/${ids}`);
    }
}
