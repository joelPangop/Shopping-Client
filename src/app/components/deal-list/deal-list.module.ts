import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealListPageRoutingModule } from './deal-list-routing.module';

import { DealListPage } from './deal-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DealListPageRoutingModule
  ],
  declarations: [DealListPage]
})
export class DealListPageModule {}
