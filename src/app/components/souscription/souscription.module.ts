import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SouscriptionPageRoutingModule} from './souscription-routing.module';

import {SouscriptionPage} from './souscription.page';
import {TranslateModule} from '@ngx-translate/core';
import {HomePageModule} from '../home/home.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SouscriptionPageRoutingModule,
        ReactiveFormsModule,
        TranslateModule,
        HomePageModule
    ],
    declarations: [SouscriptionPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SouscriptionPageModule {
}
