import {Component, OnInit} from '@angular/core';
import {NavParams} from '@ionic/angular';

@Component({
    selector: 'app-show-options',
    templateUrl: './show-options.page.html',
    styleUrls: ['./show-options.page.scss'],
})
export class ShowOptionsPage implements OnInit {

    public option;
    public language;

    constructor(public navParams: NavParams) {
        this.option = this.navParams.get('option');
    }

    ngOnInit() {
        this.language = 'En';
    }

}
