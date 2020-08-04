import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProductPageRoutingModule } from './edit-product-routing.module';

import { EditProductPage } from './edit-product.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditProductPageRoutingModule,
        TranslateModule,
        ReactiveFormsModule
    ],
  declarations: [EditProductPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditProductPageModule {}
