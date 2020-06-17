import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TdsSneakerPagePage } from './tds-sneaker-page.page';

const routes: Routes = [
  {
    path: '',
    component: TdsSneakerPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TdsSneakerPagePageRoutingModule {}
