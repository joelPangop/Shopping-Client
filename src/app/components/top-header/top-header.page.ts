import {Component, Input, OnInit} from '@angular/core';
import {NavController, PopoverController} from '@ionic/angular';
import {Platform} from '@ionic/angular';
import {ShowOptionsPage} from '../show-options/show-options.page';
import {ArticleService} from '../../services/article.service';
import {Article} from '../../models/article-interface';

@Component({
    selector: 'app-top-header',
    templateUrl: './top-header.page.html',
    styleUrls: ['./top-header.page.scss']
})
export class TopHeaderPage implements OnInit {

    isSearch: boolean;
    private articles: any;

    constructor(private platform: Platform, private popoverController: PopoverController, private articleService: ArticleService, private navCtrl: NavController) {
        this.isSearch = false;
    }

    ngOnInit() {
        this.isSearch = false;
        console.log(this.platform.platforms());
        this.articleService.loadArticles().subscribe(res => {
            this.articleService.articles = res as Article[];
        });
    }

    public async showOptions(ev, option) {
        const popover = await this.popoverController.create({
            component: ShowOptionsPage,
            event: ev,
            translucent: true,
            componentProps: {
                option
            }
        });
        return await popover.present();
    }

    onCancel($event: CustomEvent) {
        this.isSearch = false;
    }

    openSearch() {
        this.isSearch = true;
    }

    onSearch(event): void {
        const value: string = event.target.value;
        if (value) {
            this.articleService.articles = this.articleService.articles.filter((article) => {
                return article.title.toLowerCase().includes(value.toLowerCase());
            });
        }
    }

    openProfil() {
        this.navCtrl.navigateRoot('/menu/profile');
    }

    openCart() {
        this.navCtrl.navigateForward('/cart');
    }
}
