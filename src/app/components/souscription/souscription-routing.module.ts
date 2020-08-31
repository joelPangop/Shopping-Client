import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SouscriptionPage } from './souscription.page';

const routes: Routes = [
  {
    path: '',
    component: SouscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SouscriptionPageRoutingModule {}
