import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
import {AuthGuardService} from '../../services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu/tabs',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'tabs', loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule)
        // canActivate: [AuthGuardService]
      },
      {
        path: 'products',
        loadChildren: () => import('../product-list/product-list.module').then( m => m.ProductListPageModule)
      },
      {
        path: 'category/:catTitle',
        loadChildren: () => import('../category/category.module').then(m => m.CategoryPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'messagerie',
        loadChildren: () => import('../messagerie/messagerie.module').then(m => m.MessageriePageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'product-detail/:id',
        loadChildren: () => import('../product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
      },
      {
        path: 'show-options',
        loadChildren: () => import('../show-options/show-options.module').then( m => m.ShowOptionsPageModule)
      },
      {
        path: 'edit-product/:id',
        loadChildren: () => import('../edit-product/edit-product.module').then( m => m.EditProductPageModule)
      },
      {
        path: 'action-message/:id/:action/:uid/:artId',
        loadChildren: () => import('../action-message/action-message.module').then( m => m.ActionMessagePageModule)
      },
      {
        path: 'stripe',
        loadChildren: () => import('../stripe/stripe.module').then(m => m.StrikePageModule)
      },
      {
        path: 'about/:param',
        loadChildren: () => import('../about/about.module').then( m => m.AboutPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../register/register.module').then( m => m.RegisterPageModule)
      },
      {
        path: 'live-chat',
        loadChildren: () => import('../live-chat/live-chat.module').then( m => m.LiveChatPageModule)
      },
      {
        path: 'tds-sneaker-page',
        loadChildren: () => import('../tds-sneaker-page/tds-sneaker-page.module').then( m => m.TdsSneakerPagePageModule)
      },
      {
        path: 'store',
        loadChildren: () => import('../store/store.module').then( m => m.StorePageModule)
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
