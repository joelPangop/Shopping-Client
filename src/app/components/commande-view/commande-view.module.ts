import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommandeViewPageRoutingModule } from './commande-view-routing.module';

import { CommandeViewPage } from './commande-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommandeViewPageRoutingModule
  ],
  declarations: [CommandeViewPage]
})
export class CommandeViewPageModule {}
