import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StrikePageRoutingModule } from './stripe-routing.module';

import { StripePage } from './stripe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StrikePageRoutingModule
  ],
  declarations: [StripePage]
})
export class StrikePageModule {}
