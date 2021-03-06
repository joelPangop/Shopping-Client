import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule, NgControl, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {HomePage} from './home.page';
import {SearchbarPageModule} from '../searchbar/searchbar.module';
import {HomeTopSliderPageModule} from '../home-top-slider/home-top-slider.module';
import {CategoriesPageModule} from '../categories/categories.module';
import {HotDealsPageModule} from '../hot-deals/hot-deals.module';
import {FeaturedProductsPageModule} from '../featured-products/featured-products.module';
import {HomePageRoutingModule} from './home-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {IonicSelectableModule} from 'ionic-selectable';
import {TopHeaderPageModule} from '../header/top-header/top-header.module';
import {HeaderComponent} from '../header/header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {SharedDirectivesModule} from '../../directives/shared-directives.module';
// import {ProductListPage} from '../product-list/product-list.page';

@NgModule({

    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        SearchbarPageModule,
        HomeTopSliderPageModule,
        CategoriesPageModule,
        HotDealsPageModule,
        FormsModule,
        FeaturedProductsPageModule,
        TranslateModule,
        IonicSelectableModule,
        TopHeaderPageModule,
        SharedDirectivesModule
    ],
    declarations: [HomePage, HeaderComponent, FooterComponent],
    exports: [
        FooterComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {
}
