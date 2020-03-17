import {Component, OnInit} from '@angular/core';
import {NavParams} from '@ionic/angular';

@Component({
    selector: 'app-preview-image',
    templateUrl: './preview-image.page.html',
    styleUrls: ['./preview-image.page.scss'],
})
export class PreviewImagePage implements OnInit {

    title: string;
    filename: string;

    constructor(public navParams: NavParams) {
        this.title = this.navParams.get('title');
        this.filename = this.navParams.get('image');
    }

    ngOnInit() {
    }

}
