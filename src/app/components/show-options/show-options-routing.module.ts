import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowOptionsPage } from './show-options.page';

const routes: Routes = [
  {
    path: '',
    component: ShowOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowOptionsPageRoutingModule {}
