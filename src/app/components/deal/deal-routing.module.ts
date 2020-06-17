import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealPage } from './deal.page';

const routes: Routes = [
  {
    path: '',
    component: DealPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealPageRoutingModule {}
