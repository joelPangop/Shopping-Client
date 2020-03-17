import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopHeaderPage } from './top-header.page';

const routes: Routes = [
  {
    path: '',
    component: TopHeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopHeaderPageRoutingModule {}
