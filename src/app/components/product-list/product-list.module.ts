import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductListPageRoutingModule } from './product-list-routing.module';

import { ProductListPage } from './product-list.page';
import {TopHeaderPageModule} from '../top-header/top-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {FilterPage} from '../filter/filter.page';
import {HomeTopSliderPageModule} from '../home-top-slider/home-top-slider.module';
import {SearchbarPageModule} from '../searchbar/searchbar.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        ProductListPageRoutingModule,
        TopHeaderPageModule,
        TranslateModule,
        HomeTopSliderPageModule
    ],
  declarations: [ProductListPage]
})
export class ProductListPageModule {}
