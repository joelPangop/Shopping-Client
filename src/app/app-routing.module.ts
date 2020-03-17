import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)},
  {
    path: 'intro',
    loadChildren: () => import('./components/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'category/:catTitle',
    loadChildren: () => import('./components/category/category.module').then(m => m.CategoryPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'messagerie',
    loadChildren: () => import('./components/messagerie/messagerie.module').then(m => m.MessageriePageModule)
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
    path: 'preview-image',
    loadChildren: () => import('./components/preview-image/preview-image.module').then( m => m.PreviewImagePageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./components/menu/menu.module').then( m => m.MenuPageModule)
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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
