import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    pages = [
        {
            title: 'MENU.main',
            url: '/menu/product-list',
            icon: 'home'
        },
        {
            title: 'MENU.categorie',
            children: [
                {
                    title: 'MENU.habit',
                    description: 'description',
                    icon: 'shirt',
                    url: '/menu/category/Vetements'
                },
                {
                    title: 'MENU.electroniques',
                    description: 'description',
                    icon: 'phone-portrait',
                    url: '/menu/category/Electroniques'
                },
                {
                    title: 'MENU.mode_accessoire',
                    description: 'description',
                    icon: 'bowtie',
                    url: '/menu/category/Mode & Accessoires'
                },
                {
                    title: 'MENU.chaussure',
                    description: 'description',
                    icon: 'archive',
                    url: '/menu/category/Chaussures'
                },
                {
                    title: 'MENU.automobile',
                    description: 'description',
                    icon: 'car',
                    url: '/menu/category/Automobiles'
                },
                {
                    title: 'MENU.home',
                    description: 'description',
                    icon: 'home',
                    url: '/menu/category/Maison & Jardin'
                }
            ]
        },
        {
            title: 'MENU.compte',
            children: [
                {
                    title: 'Profile',
                    url: '/menu/profile',
                    icon: 'person'
                },
                {
                    title: 'MENU.message',
                    url: '/menu/messagerie',
                    icon: 'mail'
                },
                {
                    title: 'Live chat',
                    url: '/menu/live-chat',
                    icon: 'chatbubbles'
                },
                {
                    title: 'MENU.panier',
                    url: '/menu/cart',
                    icon: 'cart'
                },
                {
                    title: 'MENU.connexion',
                    url: '/intro',
                    icon: 'log-out'
                }
            ]
        }
    ];

    constructor(private languageService: LanguageService) {
    }

    ngOnInit() {
    }

}
