import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowCatOptionPageRoutingModule } from './show-cat-option-routing.module';

import { ShowCatOptionPage } from './show-cat-option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowCatOptionPageRoutingModule
  ],
  declarations: [ShowCatOptionPage]
})
export class ShowCatOptionPageModule {}
