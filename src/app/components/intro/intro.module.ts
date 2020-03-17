import {NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {IntroPageRoutingModule} from './intro-routing.module';

import {IntroPage} from './intro.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        IntroPageRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [IntroPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class IntroPageModule {
}
