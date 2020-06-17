import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTopSliderPage } from './home-top-slider.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTopSliderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTopSliderPageRoutingModule {}
