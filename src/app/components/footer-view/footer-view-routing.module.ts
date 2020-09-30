import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FooterViewPage } from './footer-view.page';

const routes: Routes = [
  {
    path: '',
    component: FooterViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FooterViewPageRoutingModule {}
