import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../models/environements';
import {Observable} from 'rxjs';
import {Message} from '../models/message-interface';
import {Notification} from '../models/notification-interface';
import {Utilisateur} from '../models/utilisateur-interface';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(private http: HttpClient) {
    }

    loadReceivedMessages(id): Observable<Message[]> {
        const url = `${environment.api_url}/Utilisateur/${id}/messages`;
        return this.http.get<Message[]>(url);
    }

    loadSent(username): Observable<Message[]> {
        const url = `${environment.api_url}/Messages/sent/${username}`;
        return this.http.get<Message[]>(url);
    }

    loadReceivedNotifications(id): Observable<Notification[]> {
        const url = `${environment.api_url}/Utilisateur/${id}/notifications`;
        return this.http.get<Notification[]>(url);
    }

    loadMessageById(id): Observable<Message> {
        const url = `${environment.api_url}/Message/${id}`;
        return this.http.get<Message>(url);
    }

    getUserByAvatar(avatar): Observable<Utilisateur> {
        const url = `${environment.api_url}/Utilisateurs/${avatar}`;
        return this.http.get<Utilisateur>(url);
    }

    send(url, message) {
        return this.http.post(url, message);
    }

    changeState(id, body) {
        return this.http.put(`${environment.api_url}/Message/${id}`, body);
    }
}
