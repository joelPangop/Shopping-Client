import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderViewPage } from './order-view.page';

const routes: Routes = [
  {
    path: '',
    component: OrderViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderViewPageRoutingModule {}
