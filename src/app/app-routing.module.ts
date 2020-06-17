import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'onbroading', pathMatch: 'full' },
  {
    path: 'menu', loadChildren: './components/menu/menu.module#MenuPageModule',
    canActivate: [AuthGuardService]
  },
  { path: 'onbroading', loadChildren: () => import('./components/onbroading/onbroading.module').then(m => m.OnbroadingPageModule) },
  { path: 'landing-page', loadChildren: () => import('./components/auth/landing-page/landing-page.module').then(m => m.LandingPagePageModule) },
  { path: 'signup', loadChildren: () => import('./components/auth/signup/signup.module').then(m => m.SignupPageModule) },
  { path: 'signin', loadChildren: () => import('./components/auth/signin/signin.module').then(m => m.SigninPageModule) },
  { path: 'forget-password', loadChildren: () => import('./components/auth/forget-password/forget-password.module').then(m => m.ForgetPasswordPageModule) },
  { path: 'verification', loadChildren: () => import('./components/auth/verification/verification.module').then(m => m.VerificationPageModule) },
  {
    path: 'product-view',
    loadChildren: () => import('./components/product-view/product-view.module').then( m => m.ProductViewPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./components/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'commande',
    loadChildren: () => import('./components/commande/commande.module').then( m => m.CommandePageModule)
  },
  {
    path: 'order-view',
    loadChildren: () => import('./components/order-view/order-view.module').then( m => m.OrderViewPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
