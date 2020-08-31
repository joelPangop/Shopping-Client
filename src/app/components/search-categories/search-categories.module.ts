import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchCategoriesPageRoutingModule } from './search-categories-routing.module';

import { SearchCategoriesPage } from './search-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchCategoriesPageRoutingModule
  ],
  declarations: [SearchCategoriesPage]
})
export class SearchCategoriesPageModule {}
