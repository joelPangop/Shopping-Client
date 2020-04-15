import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowNotificationPage } from './show-notification.page';

const routes: Routes = [
  {
    path: '',
    component: ShowNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowNotificationPageRoutingModule {}
