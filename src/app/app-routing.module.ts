import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  {
    path: 'menu',
    loadChildren: () => import('./components/menu/menu.module').then( m => m.MenuPageModule),
    canActivate: [AuthGuardService]
  },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)},
  {
    path: 'intro',
    loadChildren: () => import('./components/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./components/cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'product-detail/:id',
    loadChildren: () => import('./components/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
  },
  {
    path: 'create-product',
    loadChildren: () => import('./components/create-product/create-product.module').then(m => m.CreateProductPageModule)
  },
  {
    path: 'show-options',
    loadChildren: () => import('./components/show-options/show-options.module').then( m => m.ShowOptionsPageModule)
  },
  {
    path: 'top-header',
    loadChildren: () => import('./components/top-header/top-header.module').then( m => m.TopHeaderPageModule)
  },
  {
    path: 'edit-product/:id',
    loadChildren: () => import('./components/edit-product/edit-product.module').then( m => m.EditProductPageModule)
  },
  {
    path: 'action-message/:id/:action/:uid',
    loadChildren: () => import('./components/action-message/action-message.module').then( m => m.ActionMessagePageModule)
  },
  {
    path: 'stripe',
    loadChildren: () => import('./components/stripe/stripe.module').then(m => m.StrikePageModule)
  },
  {
    path: 'stripe-web/:params',
    loadChildren: () => import('./components/stripe-web/stripe.module').then(m => m.StripeWebPageModule)
  },
  {
    path: 'paypal/:params',
    loadChildren: () => import('./components/paypal/paypal.module').then( m => m.PaypalPageModule)
  },
  {
    path: 'about/:param',
    loadChildren: () => import('./components/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'paypal-web/:params',
    loadChildren: () => import('./components/paypal-web/paypal-web.module').then( m => m.PaypalWebPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'live-chat',
    loadChildren: () => import('./components/live-chat/live-chat.module').then( m => m.LiveChatPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('./components/product-list/product-list.module').then( m => m.ProductListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
