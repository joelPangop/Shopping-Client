import {Component, OnInit} from '@angular/core';
import {Utilisateur} from '../../models/utilisateur-interface';
import {ToastController} from '@ionic/angular';
import {text} from 'express';

@Component({
    selector: 'app-live-chat',
    templateUrl: './live-chat.page.html',
    styleUrls: ['./live-chat.page.scss'],
})
export class LiveChatPage implements OnInit {
    message: string = '';
    messages = [];
    currentUser = '';
    utilisateur: Utilisateur;
    onTyping:any = '';
    timeout;
    typing: boolean = false;
    userTyping = '';

    constructor(private toastCtrl: ToastController) {
    }

    async ngOnInit() {
        // this.socket.connect();
        let name = `User-${new Date().getTime()}`;
        // this.currentUser = name;

        // this.socket.emit('set-name', this.utilisateur.username);
        // this.socket.emit('set-name', this.utilisateur.username);
        //
        // this.socket.fromEvent('users-changed').subscribe(data => {
        //     console.log('got data', data);
        //     if (data['event'] === 'left' && this.currentUser !== data['user']) {
        //         // @ts-ignore
        //         this.showToast(`${data.user} has left`);
        //     } else if (data['event'] === 'joined' && this.currentUser !== data['user']) {
        //         // @ts-ignore
        //         this.showToast(`${data.user} has joined`);
        //     }
        // });
        //
        // this.socket.fromEvent('message').subscribe(message => {
        //     console.log('New:', message);
        //     this.messages.push(message);
        // });
        //
        // this.socket.fromEvent('notify-typing').subscribe(message => {
        //     this.onTyping = message;
        //     this.userTyping = message['user'];
        //     console.log('type:', this.onTyping);
        // });
    }

    sendMessage() {
        // this.socket.emit('send-message', {text: this.message});
        this.message = '';
    }

    onType = () => {
        // this.socket.emit(' typing', {
        //     text: name + ' is typing ...'
        // });

        this.typing = true;

        // this.socket.emit('typing', {
        //     text: this.utilisateur.username + " is typing ..."
        // });
        clearTimeout(this.timeout);
        // @ts-ignore
        this.timeout = setTimeout(this.timeoutFunction, 1000);
    };

     timeoutFunction = () => {
        // this.typing = false;
        //console.log("stopped typing");
        // socket.emit("typing", false);
        // this.socket.emit('typing', {
        //     text: "" //name + " stopped typing"
        // });
    };

    ionViewWillLeave() {
        // this.socket.disconnect();
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
