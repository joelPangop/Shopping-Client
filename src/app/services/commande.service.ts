import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Commande} from '../models/commande-interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../models/environements';
import {Utilisateur} from '../models/utilisateur-interface';

@Injectable({
    providedIn: 'root'
})
export class CommandeService {

    commande = {} as Commande;
    public cartItemCount = new BehaviorSubject(0);

    constructor(private http: HttpClient) {
        this.commande = {} as Commande;
    }

    createCommande(): Observable<Commande> {
        return this.http.post<Commande>(`${environment.api_url1}/commande`, this.commande);
    }

    updateCommande(): Observable<any> {
        return this.http.put<any>(`${environment.api_url1}/commande/${this.commande._id}`, this.commande);
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
}
