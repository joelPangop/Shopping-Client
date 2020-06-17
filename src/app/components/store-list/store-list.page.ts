import {Component, OnInit} from '@angular/core';
import {Store} from '../../models/store-interface';
import {NavController, NavParams} from '@ionic/angular';
import {environment} from '../../models/environements';

@Component({
    selector: 'app-store-list',
    templateUrl: './store-list.page.html',
    styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {

    stores = [] as Store[];
    public ip: string;

    constructor(private navParams: NavParams) {
      this.stores = this.navParams.get('stores');
    }

    ngOnInit() {
        this.ip = environment.api_url;
        this.stores = this.navParams.get('stores');
    }

    setStore(store: Store) {
        console.log(store);
        const popover = this.navParams.get('popover');
        popover.dismiss(store);
    }
}
