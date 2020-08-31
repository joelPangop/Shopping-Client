import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../models/environements';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Message} from '../models/message-interface';
import {Notification} from '../models/notification-interface';
import {Utilisateur} from '../models/utilisateur-interface';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    messageNotifications: Notification[];
    likeNotifications: Notification[];
    messages = [] as Message[];
    message = {} as Message;
    public _notificationCount = new BehaviorSubject<number>(0);

    constructor(private http: HttpClient) {
        this.messageNotifications = [] as Notification[];
        this.likeNotifications = [] as Notification[];
        // this._notificationCount = new Subject<number>();
    }

    loadReceivedMessages(id): Observable<Message[]> {
        const url = `${environment.api_url}/Utilisateur/${id}/messages`;
        return this.http.get<Message[]>(url);
    }

    loadSent(username): Observable<Message[]> {
        const url = `${environment.api_url}/Messages/sent/${username}`;
        return this.http.get<Message[]>(url);
    }

    loadMessages(username, interlocutorId, articleId) {
        const url = `${environment.api_url}/Messages/all/${username}/interlocutor/${interlocutorId}/article/${articleId}`;
        return this.http.get<Message[]>(url);
    }

    loadReceivedMessagesNotifications(id): Observable<Notification[]> {
        let param = 'Message';
        const url = `${environment.api_url}/Utilisateur/${id}/notifications/${param}`;
        return this.http.get<Notification[]>(url);
    }

    loadReceivedLikesNotifications(id): Observable<Notification[]> {
        const url = `${environment.api_url}/Utilisateur/${id}/notifications/Like`;
        return this.http.get<Notification[]>(url);
    }

    loadAllNotifications(id): Observable<Notification[]> {
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

    addNotification(notification: Notification) {
        const url = `${environment.api_url}/notifications`;
        return this.http.post(url, notification);
    }

    send(url, message) {
        return this.http.post(url, message);
    }

    changeState(id, body):Observable<Message> {
        return this.http.put<Message>(`${environment.api_url}/Message/${id}`, body);
    }

    deleteMessage(msg) {
        return this.http.delete(`${environment.api_url}/Message/${msg._id}`);
    }

    updateNotification(id, body):Observable<Notification> {
        return this.http.put<Notification>(`${environment.api_url}/Notification/${id}`, body);
    }

    // get notificationCount(): Subject<number> {
    //     return this._notificationCount;
    // }

    setNotificationCount(value: number) {
        this._notificationCount.next(value);
    }
}
