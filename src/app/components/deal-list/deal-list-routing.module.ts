import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealListPage } from './deal-list.page';

const routes: Routes = [
  {
    path: '',
    component: DealListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealListPageRoutingModule {}
