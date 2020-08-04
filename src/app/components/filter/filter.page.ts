import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, Platform, PopoverController} from '@ionic/angular';
import {SearchCategoriesPage} from '../search-categories/search-categories.page';
import {BehaviorSubject} from 'rxjs';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article-interface';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

    categories: string[] = [];
    priceRange: any;
    yearRange: any;
    colors: any = ['#CECE45', '#F951E2', '#CF0114'];
    sizes: any = ['S', 'M', 'L', 'XL'];
    brands: any = ['Gucci', 'Chanel', 'Louis Vuitton', 'Hermès', 'Nike', 'Prada'];
    // @ts-ignore
    catOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    articles: Article[] = [];
    prices: number[] = [];
    maxPrice: number;
    minYear: number;
    maxYear: number;
    condition: string;
    kilometers: number;
    models: string[];
    model: string;
    filterObject: BehaviorSubject<any>;

    constructor(public modalController: ModalController, private popoverController: PopoverController, public articleService: ArticleService,
                private navParams: NavParams) {
    }

    ngOnInit() {
        this.filterObject = this.navParams.get('filterObject');
        let years = [];
        this.configure();
        this.articleService.loadArticles().subscribe((res) => {
            this.articles = res;
            for (let art of this.articles) {
                this.prices.push(art.price);
                if(art.year){
                    years.push(art.year);
                }

            }
            this.maxPrice = this.getMax(this.prices);
            this.maxYear = this.getMax(years);
            this.minYear = this.getMin(years);
        });
    }

    getMax(arr) {
        let max;
        for (let i = 0; i < arr.length; i++) {
            if (max == null || parseInt(arr[i]) > parseInt(max)) {
                max = arr[i];
            }
        }
        return max;
    }

    getMin(arr) {
        let min;
        for (let i = 0; i < arr.length; i++) {
            if (min == null || parseInt(arr[i]) < parseInt(min)) {
                min = arr[i];
            }
        }
        return min;
    }

    configure() {
        this.priceRange = {
            lower: 30,
            upper: 60
        };
    }

    dismiss() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    async chooseCategory(ev) {
        const popover = await this.popoverController.create({
            component: SearchCategoriesPage,
            event: ev,
            translucent: true,
            cssClass: 'my-custom-dialog',
            componentProps: {
                catOptionSubject: this.catOptionSubject
            }
        });

        popover.onDidDismiss()
            .then((data) => {
                console.log(data.data);
                console.log(this.catOptionSubject.value);
                this.categories = this.catOptionSubject.value as string[];
            });
        return await popover.present();
    }

    apply() {
        console.log(this.priceRange);
        console.log(this.condition);
        console.log(this.kilometers);
        this.filterObject.next({
            priceRange: this.priceRange,
            condition: this.condition,
            kilometers: this.kilometers
        })
    }
}
