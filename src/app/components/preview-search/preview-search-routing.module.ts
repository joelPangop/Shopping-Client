import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewSearchPage } from './preview-search.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewSearchPageRoutingModule {}
