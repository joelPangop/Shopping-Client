import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewVideoPageRoutingModule } from './preview-video-routing.module';

import { PreviewVideoPage } from './preview-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewVideoPageRoutingModule
  ],
  declarations: [PreviewVideoPage]
})
export class PreviewVideoPageModule {}
