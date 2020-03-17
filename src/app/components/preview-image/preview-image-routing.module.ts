import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewImagePage } from './preview-image.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewImagePageRoutingModule {}
