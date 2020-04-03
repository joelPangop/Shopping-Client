import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    pages = [
        {
            title: 'Home',
            url: '/menu/product-list',
            icon: 'home'
        },
        {
            title: 'Categories',
            children: [
                {
                    title: 'Vetements',
                    description: 'description',
                    icon: 'shirt',
                    url: '/menu/category/Vetements'
                },
                {
                    title: 'Electroniques',
                    description: 'description',
                    icon: 'phone-portrait',
                    url: '/menu/category/electroniques'
                },
                {
                    title: 'Mode & Accessoires',
                    description: 'description',
                    icon: 'bowtie',
                    url: '/menu/category/Mode & Accessoires'
                },
                {
                    title: 'Chaussures',
                    description: 'description',
                    icon: 'archive',
                    url: '/menu/category/Chaussures'
                }
            ]
        },
        {
            title: 'Mon compte',
            children: [
                {
                    title: 'Profile',
                    url: '/menu/profile',
                    icon: 'person'
                },
                {
                    title: 'Message',
                    url: '/menu/messagerie',
                    icon: 'mail'
                },
                {
                    title: 'Live chat',
                    url: '/menu/live-chat',
                    icon: 'chatbubbles'
                },
                {
                    title: 'Panier',
                    url: '/menu/live-chat',
                    icon: 'cart'
                },
                {
                    title: 'logOut',
                    url: '/menu/intro',
                    icon: 'log-out'
                }
            ]
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
