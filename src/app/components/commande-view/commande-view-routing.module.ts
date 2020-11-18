import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommandeViewPage } from './commande-view.page';

const routes: Routes = [
  {
    path: '',
    component: CommandeViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommandeViewPageRoutingModule {}
