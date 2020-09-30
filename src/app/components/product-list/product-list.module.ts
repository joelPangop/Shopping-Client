import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProductListPageRoutingModule} from './product-list-routing.module';

import {ProductListPage} from './product-list.page';
import {TopHeaderPageModule} from '../header/top-header/top-header.module';
import {HomeTopSliderPageModule} from '../home-top-slider/home-top-slider.module';
import {TranslateModule} from '@ngx-translate/core';
import {HomePageModule} from '../home/home.module';
import {SearchbarPageModule} from '../searchbar/searchbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        ProductListPageRoutingModule,
        TopHeaderPageModule,
        HomeTopSliderPageModule,
        TranslateModule.forChild(),
        HomePageModule,
        SearchbarPageModule
    ],
  declarations: [ProductListPage]
})
export class ProductListPageModule {}
