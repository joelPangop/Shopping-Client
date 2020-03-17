import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProductDetailPageRoutingModule} from './product-detail-routing.module';

import {ProductDetailPage} from './product-detail.page';
import {IonicRatingModule} from 'ionic4-rating/dist';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductDetailPageRoutingModule,
        ReactiveFormsModule,
        IonicRatingModule
    ],
    declarations: [ProductDetailPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ProductDetailPageModule {
}
