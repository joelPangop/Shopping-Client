import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankViewPageRoutingModule } from './bank-view-routing.module';

import { BankViewPage } from './bank-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankViewPageRoutingModule
  ],
  declarations: [BankViewPage]
})
export class BankViewPageModule {}
