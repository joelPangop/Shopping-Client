import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductViewPageRoutingModule } from './product-view-routing.module';

import { ProductViewPage } from './product-view.page';
import {IonicRatingModule} from 'ionic4-rating/dist';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductViewPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [ProductViewPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProductViewPageModule {}
