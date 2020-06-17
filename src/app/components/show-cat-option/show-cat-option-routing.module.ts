import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowCatOptionPage } from './show-cat-option.page';

const routes: Routes = [
  {
    path: '',
    component: ShowCatOptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowCatOptionPageRoutingModule {}
