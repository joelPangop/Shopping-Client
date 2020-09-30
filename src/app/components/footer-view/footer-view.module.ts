import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FooterViewPageRoutingModule } from './footer-view-routing.module';

import { FooterViewPage } from './footer-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterViewPageRoutingModule
  ],
  declarations: [FooterViewPage]
})
export class FooterViewPageModule {}
