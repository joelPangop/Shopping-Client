import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CheckoutPageRoutingModule} from './checkout-routing.module';

import {CheckoutPage} from './checkout.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CheckoutPageRoutingModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [CheckoutPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutPageModule {
}
