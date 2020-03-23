import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActionMessagePageRoutingModule } from './action-message-routing.module';

import { ActionMessagePage } from './action-message.page';
import {LongPressModule} from 'ionic-long-press';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActionMessagePageRoutingModule,
    LongPressModule
  ],
  declarations: [ActionMessagePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ActionMessagePageModule {}
