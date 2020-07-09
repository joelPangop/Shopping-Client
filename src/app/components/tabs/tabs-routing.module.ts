import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TabsPage} from './tabs.page';
import {AuthGuardService} from '../../services/auth-guard.service';

const routes: Routes = [

    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'tab1',
                loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
                // loadChildren: '../home/home.module#HomePageModule',
                // canActivate: [AuthGuardService]
            },
            {
                path: 'tab2',
                loadChildren: () =>
                    import('../deal/deal.module').then(m => m.DealPageModule)
            },

            {
                path: 'tab3',
                loadChildren: () =>
                    import('../wishlist/wishlist.module').then(m => m.WishlistPageModule)
            },
            {
                path: 'tab4',
                loadChildren: () =>
                    import('../notification/notification.module').then(m => m.NotificationPageModule)
            },
            {
                path: 'tab5',
                loadChildren: () =>
                    import('../profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('../categories/categories.module').then(m => m.CategoriesPageModule)
            },
            {
                path: 'products',
                loadChildren: () => import('../product-list/product-list.module').then(m => m.ProductListPageModule)
            },
            {
                path: 'orders',
                loadChildren: () =>
                    import('../orders/orders.module').then(m => m.OrdersPageModule)
            },
            {
                path: 'create-product',
                loadChildren: () => import('../create-product/create-product.module').then(m => m.CreateProductPageModule)
            },
            {
                path: 'category/:catTitle',
                loadChildren: () => import('../category/category.module').then(m => m.CategoryPageModule)
            },
            {
                path: 'category',
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
                loadChildren: () => import('../show-options/show-options.module').then(m => m.ShowOptionsPageModule)
            },
            {
                path: 'edit-product/:id',
                loadChildren: () => import('../edit-product/edit-product.module').then(m => m.EditProductPageModule)
            },
            {
                path: 'action-message/:id/:action/:uid/:artId',
                loadChildren: () => import('../action-message/action-message.module').then(m => m.ActionMessagePageModule)
            },
            {
                path: 'stripe',
                loadChildren: () => import('../stripe/stripe.module').then(m => m.StrikePageModule)
            },
            {
                path: 'about/:param',
                loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule)
            },
            {
                path: 'register',
                loadChildren: () => import('../register/register.module').then(m => m.RegisterPageModule)
            },
            {
                path: 'live-chat',
                loadChildren: () => import('../live-chat/live-chat.module').then(m => m.LiveChatPageModule)
            },
            {
                path: 'tds-sneaker-page',
                loadChildren: () => import('../tds-sneaker-page/tds-sneaker-page.module').then(m => m.TdsSneakerPagePageModule)
            },
            {
                path: 'store',
                loadChildren: () => import('../store/store.module').then(m => m.StorePageModule)
            },
            {
                path: 'category-preview',
                loadChildren: () => import('../category-preview/category-preview.module').then(m => m.CategoryPreviewPageModule)
            },
            {
                path: 'show-cat-option',
                loadChildren: () => import('../show-cat-option/show-cat-option.module').then(m => m.ShowCatOptionPageModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
