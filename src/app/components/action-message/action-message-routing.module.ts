import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionMessagePage } from './action-message.page';

const routes: Routes = [
  {
    path: '',
    component: ActionMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionMessagePageRoutingModule {}
