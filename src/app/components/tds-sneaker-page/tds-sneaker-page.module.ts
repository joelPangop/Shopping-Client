import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TdsSneakerPagePageRoutingModule } from './tds-sneaker-page-routing.module';

import { TdsSneakerPagePage } from './tds-sneaker-page.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TdsSneakerPagePageRoutingModule,
        TranslateModule
    ],
  declarations: [TdsSneakerPagePage]
})
export class TdsSneakerPagePageModule {}
