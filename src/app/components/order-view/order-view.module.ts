import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderViewPageRoutingModule } from './order-view-routing.module';

import { OrderViewPage } from './order-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderViewPageRoutingModule
  ],
  declarations: [OrderViewPage]
})
export class OrderViewPageModule {}
