import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewSearchPageRoutingModule } from './preview-search-routing.module';

import { PreviewSearchPage } from './preview-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewSearchPageRoutingModule
  ],
  declarations: [PreviewSearchPage]
})
export class PreviewSearchPageModule {}
