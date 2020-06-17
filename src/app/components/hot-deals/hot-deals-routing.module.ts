import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotDealsPage } from './hot-deals.page';

const routes: Routes = [
  {
    path: '',
    component: HotDealsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotDealsPageRoutingModule {}
