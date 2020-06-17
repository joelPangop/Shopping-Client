import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotDealsPageRoutingModule } from './hot-deals-routing.module';

import { HotDealsPage } from './hot-deals.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HotDealsPageRoutingModule
    ],
    exports: [
        HotDealsPage
    ],
    declarations: [HotDealsPage]
})
export class HotDealsPageModule {}
