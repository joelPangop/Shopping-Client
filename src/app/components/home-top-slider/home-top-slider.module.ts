import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTopSliderPageRoutingModule } from './home-top-slider-routing.module';

import { HomeTopSliderPage } from './home-top-slider.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomeTopSliderPageRoutingModule,
        TranslateModule
    ],
    exports: [
        HomeTopSliderPage
    ],
    declarations: [HomeTopSliderPage]
})
export class HomeTopSliderPageModule {}
