import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowNotificationPageRoutingModule } from './show-notification-routing.module';

import { ShowNotificationPage } from './show-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowNotificationPageRoutingModule
  ],
  declarations: [ShowNotificationPage]
})
export class ShowNotificationPageModule {}
