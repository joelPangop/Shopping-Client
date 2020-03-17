import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewImagePageRoutingModule } from './preview-image-routing.module';

import { PreviewImagePage } from './preview-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewImagePageRoutingModule
  ],
  declarations: [PreviewImagePage]
})
export class PreviewImagePageModule {}
