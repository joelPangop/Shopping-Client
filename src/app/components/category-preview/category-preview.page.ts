import {Component, OnInit} from '@angular/core';
import {Utilisateur} from '../../models/utilisateur-interface';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-category-preview',
    templateUrl: './category-preview.page.html',
    styleUrls: ['./category-preview.page.scss'],
})
export class CategoryPreviewPage implements OnInit {
    utilisateur = {} as Utilisateur;
    notifications = [];
    ip;
    slideOpts = {
        speed: 1000,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
        },
        autoplay: {
            delay: 500
        }
    };
    resultRate = '1.0';
    grid: Boolean = true;
    oneColumn: Boolean = false;
    list: Boolean = false;

    category: any;
    images: string[];
    sousCats: any[];

    constructor(private route: ActivatedRoute, private router: Router, private navCtrl: NavController) {
        this.images = [];
        this.category = {};
        this.route.queryParams.subscribe(params => {
            if (params && params.special) {
                this.category = JSON.parse(params.special);
                this.sousCats = this.filterBySousCategory(this.category.sousCat);
                this.images = this.category ? this.category.image : [];
                this.shuffle(this.images);
            }
        });
    }

    ngOnInit() {
        this.images = this.category ? this.category.image : [];
        this.shuffle(this.images);
        this.sousCats = this.filterBySousCategory(this.category.sousCat);
    }

    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    prettyArrayString(array: string[]) {
        let cats = '';
        for (let str of array) {
            cats = cats + ' ' + str + ' ';
        }
        return cats;
    }

    goToCat(cats) {
        // this.router.navigate(['tabs/category/{"cats":' + JSON.stringify(cats) + '}']);
        this.navCtrl.navigateForward('tabs/category/{"cats":' + JSON.stringify(cats) + '}');
    }

    filterBySousCategory(cats) {
        return Array.from(new Set(cats.map(s => s[1])));
    }

    getSousCatOptions(cat) {
        let tab = [];
        tab = this.category.sousCat.filter(c => c[1] === cat);
        return tab;
    }
}
