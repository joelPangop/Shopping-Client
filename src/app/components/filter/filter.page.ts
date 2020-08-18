import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, Platform, PopoverController, ToastController} from '@ionic/angular';
import {SearchCategoriesPage} from '../search-categories/search-categories.page';
import {BehaviorSubject} from 'rxjs';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article-interface';
import {TranslateService} from '@ngx-translate/core';
import {categories} from '../../models/Category';
import {Utils} from '../../Utils';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

    categories: string[] = [];
    colors: any = [];
    // colors: any = ['#CECE45', '#F951E2', '#CF0114'];
    sizes: any = [];
    chose_sizes: any = [];
    // sizes: any = ['S', 'M', 'L', 'XL'];
    brands: any = [];
    // brands: any = ['Gucci', 'Chanel', 'Louis Vuitton', 'Hermès', 'Nike', 'Prada'];
    // @ts-ignore
    catOptionSubject: BehaviorSubject<any> = new BehaviorSubject();
    articles: Article[] = [];
    articlesToSort: Article[] = [];
    prices: number[] = [];
    maxPrice: number = 0;
    minPrice: number = 0;
    minYear: number = 0;
    maxYear: number;
    condition: string;
    start_kilometers: number;
    end_kilometers: number;
    models: string[];
    model: string;
    filterObject: BehaviorSubject<any>;
    choosenColors: string[] = [];
    choosenSizes: string[] = [];
    choosenBrands: string[] = [];
    transmission: string;
    mainCategories: any[];
    mainCategorie = {} as any;
    secondCategorie = {} as any;
    thirdCategorie = {} as any;

    constructor(public modalController: ModalController, private popoverController: PopoverController, public articleService: ArticleService,
                private navParams: NavParams, private translateService: TranslateService, private toastCtrl: ToastController) {
    }

    ngOnInit() {
        this.filterObject = this.navParams.get('filterObject');
        this.mainCategories = categories;

        let years = [];
        this.articleService.loadArticles().subscribe((res) => {
            // this.articles = res;
            this.colors = [];
            this.sizes = [];
            this.chose_sizes = [];
            this.brands = [];

            for (let art of this.articles) {
                this.prices.push(art.price);
                if (art.year) {
                    years.push(art.year);
                }
            }

            if (this.filterObject.value.transmission) {
                this.transmission = this.filterObject.value.transmission;
            }

            if (this.filterObject.value.start_kilometers) {
                this.start_kilometers = this.filterObject.value.start_kilometers;
            }

            if (this.filterObject.value.minPrice) {
                this.minPrice = this.filterObject.value.minPrice;
            }

            if (this.filterObject.value.maxPrice) {
                this.maxPrice = this.filterObject.value.maxPrice;
            }

            if (this.filterObject.value.end_kilometers) {
                this.end_kilometers = this.filterObject.value.end_kilometers;
            }

            if (this.filterObject.value.condition) {
                this.condition = this.filterObject.value.condition;
            }

            if (this.filterObject.value.choosenColors) {
                this.choosenColors = this.filterObject.value.choosenColors;
            }

            if (this.filterObject.value.categories) {
                this.categories = this.filterObject.value.categories;
            }

            if (this.filterObject.value.choosenSizes) {
                this.choosenSizes = this.filterObject.value.choosenSizes;
            }

            if (this.filterObject.value.choosenBrands) {
                this.choosenBrands = this.filterObject.value.choosenBrands;
            }

            if (this.filterObject.value.mainCategorie) {
                this.mainCategorie = this.filterObject.value.mainCategorie;
            }

            if (this.filterObject.value.secondCategorie) {
                this.secondCategorie = this.filterObject.value.secondCategorie;
            }

            if (this.filterObject.value.thirdCategorie) {
                this.thirdCategorie = this.filterObject.value.thirdCategorie;
            }
            // this.getBrands();
            res.forEach(rs => {
                if (rs.categories.includes(this.mainCategorie.title) && rs.categories.includes(this.secondCategorie.title)) {
                    this.articles.push(rs);
                    if (rs.brands) {
                        this.brands.push(rs.brands);
                    }
                    if (rs.categories.includes('Mode') || rs.categories.includes('Auto')) {
                        rs.colors.forEach(c => {
                            this.colors.push(c);
                        });
                    }

                    if (rs.categories.includes('Mode') || rs.categories.includes('Vetement')) {
                        rs.sizes.forEach(c => {
                            this.sizes.push(c);
                        });
                    }
                    if (rs.categories.includes('Mode') || rs.categories.includes('Chaussure')) {
                        rs.sizes.forEach(c => {
                            this.chose_sizes.push(c);
                        });
                    }
                }
            });
            this.sizes = Array.from(new Set(this.sizes));
            this.colors = Array.from(new Set(this.colors));
            this.chose_sizes = Array.from(new Set(this.chose_sizes));
            this.brands = Array.from(new Set(this.brands));
        });
        console.log(this.colors);
    }

    clearFilter() {
        this.categories = [];
        this.transmission = undefined;
        this.colors = [];
        this.sizes = [];
        this.chose_sizes = [];
        this.brands = [];
        // @ts-ignore
        this.catOptionSubject = new BehaviorSubject();
        this.articles = [];
        this.prices = [];
        this.condition = undefined;
        this.choosenColors = [];
        this.choosenSizes = [];
        this.choosenBrands = [];
        this.maxPrice = 0;
        this.minPrice = 0;
        this.mainCategorie = {};
        this.secondCategorie = {};
        this.thirdCategorie = {};
        this.filterObject.next({
            condition: this.condition,
            categories: this.categories,
            choosenColors: this.choosenColors,
            choosenSizes: this.choosenSizes,
            choosenBrands: this.choosenBrands,
            start_kilometers: this.start_kilometers,
            end_kilometers: this.end_kilometers,
            transmission: this.transmission,
            maxPrice: this.maxPrice,
            minPrice: this.minPrice,
            mainCategorie: this.mainCategorie,
            secondCategorie: this.secondCategorie,
            thirdCategorie: this.thirdCategorie
        });

        this.articleService.loadArticles().subscribe((res) => {
            this.articleService.articles = res;
        });

        this.dismiss();
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

    dismiss() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

    apply() {
        console.log(this.condition);
        if (this.choosenBrands.length > 0) {
            this.articles = this.articles.filter((art) => {
                return this.choosenBrands.includes(art.brands);
            });
        }

        let articles = this.articles;

        if (this.choosenSizes.length > 0) {
            articles = this.articles.filter((art) => {
                if (art.sizes.length > this.choosenSizes.length) {
                    return this.arrayContainsArray(art.sizes, this.choosenSizes);
                } else {
                    return this.arrayContainsArray(this.choosenSizes, art.sizes);
                }
            });
        } else {
            articles = this.articles;
        }

        if (this.choosenColors.length > 0) {
            articles = this.articles.filter((art) => {
                if (art.colors.length > this.choosenColors.length) {
                    return this.arrayContainsArray(art.colors, this.choosenColors);
                } else {
                    return this.arrayContainsArray(this.choosenColors, art.colors);
                }
            });
        }

        if (this.transmission) {
            articles = articles.filter((art) => {
                return art.transmission === this.transmission;
            });
        }

        if (this.condition) {
            if (this.condition !== 'TOUT') {
                articles = articles.filter((art) => {
                    return art.state === this.condition;
                });
            }
        }

        console.log(articles);

        if ((this.maxPrice > 0 && this.minPrice > 0) && this.maxPrice > this.minPrice) {
            articles = this.articles.filter((res) => {
                return res.price >= this.minPrice && res.price <= this.maxPrice;
            });
            this.submitFilter(articles);
            this.dismiss();
        } else {
            this.submitFilter(articles);
            this.dismiss();
        }
    }

    submitFilter(articles) {
        this.filterObject.next({
            condition: this.condition,
            categories: this.categories,
            choosenColors: this.choosenColors,
            choosenSizes: this.choosenSizes,
            choosenBrands: this.choosenBrands,
            start_kilometers: this.start_kilometers,
            end_kilometers: this.end_kilometers,
            transmission: this.transmission,
            maxPrice: this.maxPrice,
            minPrice: this.minPrice,
            mainCategorie: this.mainCategorie,
            secondCategorie: this.secondCategorie,
            thirdCategorie: this.thirdCategorie,
            articles: articles
        });
    }

    arrayContainsArray(superset, subset) {
        if (0 === subset.length) {
            return false;
        }
        return subset.every(function(value) {
            return (superset.indexOf(value) >= 0);
        });
    }

    setBrand(item: any) {
        this.choosenBrands.push(item);
        this.articles = this.articles.filter((res) => {
            return this.choosenBrands.includes(res.brands);
        });
        console.log(this.articleService.articles);
    }

    selectMainCategorie() {
        console.log(this.mainCategorie);
        this.articleService.loadArticles().subscribe((res) => {
            if (this.mainCategorie.title) {
                // this.articleService.articles = [];
                this.articles = [];
                this.articlesToSort = [];
                res.forEach(rs => {
                    if (rs.categories.includes(this.mainCategorie.title)) {
                        this.articles.push(rs);
                        this.articlesToSort.push(rs);
                    }
                });
                this.secondCategorie = {};
                this.thirdCategorie = {};
            } else {
                this.articles = res;
            }
            this.filterObject.next({
                mainCategorie: this.mainCategorie
            });
            console.log(this.articleService.articles);
        });
    }

    selectSecondCategorie() {
        this.articleService.loadArticles().subscribe((res) => {
            if (this.secondCategorie.title) {
                // this.articleService.articles = [];
                this.articles = [];
                this.articlesToSort = [];
                this.colors = [];
                this.sizes = [];
                this.chose_sizes = [];
                this.brands = [];
                res.forEach(rs => {
                    if (rs.categories.includes(this.mainCategorie.title) && rs.categories.includes(this.secondCategorie.title)) {
                        this.articles.push(rs);
                        this.articlesToSort.push(rs);
                        if (rs.brands) {
                            this.brands.push(rs.brands);
                        }
                        if (rs.categories.includes('Mode')) {
                            rs.colors.forEach(c => {
                                this.colors.push(c);
                            });
                        }
                        if (rs.categories.includes('Mode') || rs.categories.includes('Vetement')) {
                            rs.sizes.forEach(c => {
                                this.sizes.push(c);
                            });
                        }
                        if (rs.categories.includes('Mode') || rs.categories.includes('Chaussure')) {
                            rs.sizes.forEach(c => {
                                this.chose_sizes.push(c);
                            });
                        }
                    }
                });
                this.sizes = Array.from(new Set(this.sizes));
                this.colors = Array.from(new Set(this.colors));
                this.chose_sizes = Array.from(new Set(this.chose_sizes));
                this.brands = Array.from(new Set(this.brands));
                this.filterObject.next({
                    secondCategorie: this.secondCategorie
                });
            }
            this.thirdCategorie = {};
        });
    }

    selectThirdCategorie() {
        this.articleService.loadArticles().subscribe((res) => {
            if (this.thirdCategorie.title) {
                // this.articleService.articles = [];
                this.articles = [];
                this.articlesToSort = [];
                res.forEach(rs => {
                    if (rs.categories.includes(this.mainCategorie.title) && rs.categories.includes(this.secondCategorie.title) && rs.categories.includes(this.thirdCategorie.title)) {
                        this.articles.push(rs);
                        this.articlesToSort.push(rs);
                    }
                });
                this.filterObject.next({
                    thirdCategorie: this.thirdCategorie
                });
            }
        });
    }

    async presentToast(msg: string, duree: number) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: duree
        });
        await toast.present();
    }

    test() {
        console.log(this.colors);
    }
}
