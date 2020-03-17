import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateProductPageRoutingModule } from './create-product-routing.module';

import { CreateProductPage } from './create-product.page';
import {TopHeaderPageModule} from '../top-header/top-header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreateProductPageRoutingModule,
        ReactiveFormsModule,
        TopHeaderPageModule
    ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CreateProductPage]
})
export class CreateProductPageModule {}
