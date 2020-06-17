import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CategoriesService} from '../../services/categories.service';
import {NavigationExtras, Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesPage implements OnInit {
  categories = [];

  constructor(private router: Router,private categoryService: CategoriesService, private navCtrl: NavController) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categories = this.categoryService.categoriesList();
  }

  shuffleImage(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  goToCategory(cat){
    let navigationExtras: NavigationExtras= {
      queryParams: {
        special: JSON.stringify(cat)
      }
    };
    // this.router.navigate(['tabs/category-preview'], navigationExtras)
    this.navCtrl.navigateForward(['tabs/category-preview'], navigationExtras)
  }

}
