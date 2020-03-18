import {Component, OnInit} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Utilisateur} from '../../models/utilisateur-interface';
import {ToastController} from '@ionic/angular';
import {text} from 'express';

@Component({
    selector: 'app-live-chat',
    templateUrl: './live-chat.page.html',
    styleUrls: ['./live-chat.page.scss'],
})
export class LiveChatPage implements OnInit {
    message = '';
    messages = [];
    currentUser = '';
    utilisateur: Utilisateur;

    constructor(private socket: Socket, private storage: NativeStorage, private toastCtrl: ToastController) {
    }

    async ngOnInit() {
        this.socket.connect();
        let name = `User-${new Date().getTime()}`;
        this.currentUser = name;

        await this.storage.getItem('Utilisateur').then(res => {
            this.utilisateur = res;
            console.log(res);
        });

        this.socket.emit('set-name', name);
        // this.socket.emit('set-name', this.utilisateur.username);

        this.socket.fromEvent('users-changed').subscribe(data => {
            console.log('got data', data);
            if (data['event'] === 'left') {
                // @ts-ignore
                this.showToast(`${data.user} has left`);
            } else if (data['event'] === 'joined') {
                // @ts-ignore
                this.showToast(`${data.user} has joined`);
            }
        });

        this.socket.fromEvent('message').subscribe(message => {
            console.log('New:', message);
            this.messages.push(message);
        });
    }

    sendMessage(){
        this.socket.emit('send-message', {text: this.message});
        this.message = '';
    }

    ionViewWillLeave(){
        this.socket.disconnect();
    }

    async showToast(msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'top'
        });
        await toast.present();
    }

}
