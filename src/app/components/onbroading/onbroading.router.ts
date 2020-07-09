import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OnbroadingPage} from './onbroading.page';

const routes: Routes = [
    {
        path: '',
        component: OnbroadingPage,
        children: [
            {
                path: '',
                loadChildren: () => import('../auth/landing-page/landing-page.module').then(m => m.LandingPagePageModule)
            },
            {
                path: 'signup',
                loadChildren: () => import('../auth/signup/signup.module').then(m => m.SignupPageModule)
            },
            {
                path: 'signin',
                loadChildren: () => import('../auth/signin/signin.module').then(m => m.SigninPageModule)
            },
            {
                path: 'forget-password',
                loadChildren: () => import('../auth/forget-password/forget-password.module').then(m => m.ForgetPasswordPageModule)
            },
            {
                path: 'verification',
                loadChildren: () => import('../auth/verification/verification.module').then(m => m.VerificationPageModule)
            }
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class InterRouter {
}
