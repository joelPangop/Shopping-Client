import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnbroadingPageRoutingModule } from './onbroading-routing.module';

import { OnbroadingPage } from './onbroading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnbroadingPageRoutingModule
  ],
  declarations: [OnbroadingPage]
})
export class OnbroadingPageModule {}
