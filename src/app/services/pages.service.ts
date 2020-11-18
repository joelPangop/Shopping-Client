import {Injectable} from '@angular/core';
import {ArticleService} from './article.service';
import {ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PagesService {

    constructor() {
    }

    getPages() {
        return [
            {
                title: 'Home',
                url: '/menu/tabs/tab1',
                icon: 'home'
            },
            {
                title: 'Shop',
                url: '/menu/tabs/products',
                icon: 'basket'
            },
            {
                title: 'Deals',
                url: '/menu/tabs/tab2',
                icon: 'gift'
            },
            {
                title: 'Wishlist',
                url: '/menu/tabs/tab3',
                icon: 'heart'
            },
            {
                title: 'Notification',
                url: '/menu/tabs/tab4',
                icon: 'notifications-outline'
            },
            {
                title: 'MENU.categorie',
                icon: 'grid',
                children: [
                    {
                        title: 'ALL',
                        description: 'description',
                        src: 'assets/apps-outline.svg',
                        url: '/menu/tabs/categories',
                        isParent: false
                    },
                    {
                        title: 'MENU.electroniques',
                        description: 'description',
                        icon: 'phone-portrait',
                        cat: 'Electronique',
                        isParent: true
                    },
                    {
                        title: 'MENU.mode_accessoire',
                        src: 'assets/bowtie.svg',
                        description: 'description',
                        isParent: true,
                        cat: 'Mode',
                    },
                    {
                        title: 'MENU.gadget',
                        description: 'description',
                        src: 'assets/video-games.svg',
                        isParent: true,
                        cat: 'Gadget'
                    },
                    {
                        title: 'MENU.automobile',
                        description: 'description',
                        src: 'assets/car-service.svg',
                        cat: 'Automobile',
                        isParent: true
                    },
                    {
                        title: 'MENU.home',
                        description: 'description',
                        src: 'assets/bx-building-house.svg',
                        isParent: true,
                        cat: 'House'
                    },
                    {
                        title: 'MENU.industry_office',
                        description: 'description',
                        src: 'assets/industry.svg',
                        isParent: true,
                        cat: 'Office-industrie'
                    }
                ]
            },
            {
                title: 'Orders',
                url: '/menu/tabs/orders',
                icon: 'checkmark-circle-outline'
            },
            // {
            //     title: 'MENU.Souscription',
            //     url: '/menu/tabs/tab-souscription',
            //     icon: 'log-in'
            // }
        ];
    }

    getModePages(){
        return [
            {
                title: 'Vetement',
                src: 'assets/man-outlined.svg',
                children: [
                    {
                        title: 'MENU.Homme',
                        description: 'description',
                        icon: 'shirt',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Vetement", "Homme"]}'
                    },
                    {
                        title: 'MENU.Femme',
                        description: 'description',
                        src: 'assets/skirt.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Vetement", "Femme"]}'
                    },
                    {
                        title: 'Enfant',
                        description: 'description',
                        src: 'assets/clothes.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Vetement", "Enfant"]}'
                    },
                    {
                        title: 'Bebe',
                        description: 'description',
                        src: 'assets/baby-clothe.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Vetement", "Bebe"]}'
                    }
                ]
            },
            {
                title: 'Chaussure',
                src: 'assets/woman-outlined.svg',
                children: [
                    {
                        title: 'MENU.Homme',
                        description: 'description',
                        src: 'assets/footwear.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Chaussure", "Homme"]}'
                    },
                    {
                        title: 'MENU.Femme',
                        description: 'description',
                        src: 'assets/high-heeled-shoe.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Chaussure", "Femme"]}'
                    },
                    {
                        title: 'Enfant',
                        description: 'description',
                        src: 'assets/running-shoe.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Chaussure", "Enfant"]}'
                    },
                    {
                        title: 'Bebe',
                        description: 'description',
                        src: 'assets/baby-shoe.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Chaussure", "Bebe"]}'
                    }
                ]
            },
            {
                title: 'Accessoire',
                src: 'assets/kid.svg',
                children: [
                    {
                        title: 'MENU.habit',
                        description: 'description',
                        src: 'assets/fedora-hat.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Accessoire", "Homme"]}'
                    },
                    {
                        title: 'MENU.chaussure',
                        description: 'description',
                        src: 'assets/necklace.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Accessoire", "Femme"]}'

                    },
                    {
                        title: 'Enfant',
                        description: 'description',
                        src: 'assets/outline-toys.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Accessoire", "Enfant"]}'
                    },
                    {
                        title: 'Bebe',
                        description: 'description',
                        src: 'assets/baby-bottle-outline.svg',
                        url: '/menu/tabs/category/ {"cats":["Mode", "Accessoire", "Bebe"]}'
                    }
                ]
            },
            {
                title: 'Sport & Loisir',
                src: 'assets/soccer-ball.svg',
                url: '/menu/tabs/category/ {"cats":["Mode", "Sport_Loisir"]}'
            }];
    }

    getAutoPages() {
        return [
            {
                title: 'Auto',
                src: 'assets/car-sport.svg',
                children: [
                    {
                        title: 'Voiture',
                        description: 'description',
                        icon: 'car',
                        url: '/menu/tabs/category/ {"cats":["Automobile", "Auto", "Voiture"]}'
                    },
                    {
                        title: 'Moto',
                        description: 'description',
                        src: 'assets/motobike.svg',
                        url: '/menu/tabs/category/ {"cats":["Automobile", "Auto", "Moto"]}'
                    },
                    {
                        title: 'Camion',
                        description: 'description',
                        src: 'assets/truck.svg',
                        url: '/menu/tabs/category/ {"cats":["Automobile", "Auto", "Camion"]}'
                    }
                ]
            },
            {
                title: 'Accessoire',
                src: 'assets/car-battery.svg',
                children: [
                    {
                        title: 'Pieces et accessoires',
                        src: 'assets/engine-outline.svg',
                        url: '/menu/tabs/category/ {"cats":["Automobile", "Accessoire", "Piece_Accessoire"]}'
                    },
                    {
                        title: 'Depannage',
                        src: 'assets/tools-2.svg',
                        url: '/menu/tabs/category/ {"cats":["Automobile", "Accessoire", "Depannage"]}'
                    }
                ]
            }
        ];
    }

    getElectroniquesPages(){
        return [
            {
                title: 'Ordinateur',
                src: 'assets/computer-f.svg',
                children: [
                    {
                        title: 'Laptop',
                        src: 'assets/laptop-outlined.svg',
                        url: '/menu/tabs/category/ {"cats":["Electronique", "Ordinateur", "Laptop"]}'
                    },
                    {
                        title: 'Desktop',
                        src: 'assets/desktop-computer.svg',
                        url: '/menu/tabs/category/ {"cats":["Electronique", "Ordinateur", "Desktop"]}'
                    },
                    {
                        title: 'Accessoires',
                        src: 'assets/keyboard-and-mouse.svg',
                        url: '/menu/tabs/category/ {"cats":["Electronique", "Ordinateur", "Accessoire"]}'
                    }
                ]
            },
            {
                title: 'Telephone & Tablet',
                src: 'assets/ipad.svg',
                children: [
                    {
                        title: 'Telephone',
                        src: 'assets/phone.svg',
                        url: '/menu/tabs/category/ {"cats":["Electronique", "Telephone & Tablet", "Telephone"]}'
                    },
                    {
                        title: 'Tablet',
                        src: 'assets/digital.svg',
                        url: '/menu/tabs/category/ {"cats":["Electronique", "Telephone & Tablet", "Tablet"]}'
                    },
                    {
                        title: 'Accessoire',
                        src: 'assets/charge-cable.svg',
                        url: '/menu/tabs/category/ {"cats":["Electronique", "Telephone & Tablet", "Accessoire"]}'
                    }
                ]
            },
            {
                title: 'TV & Accessoires',
                src: 'assets/tv.svg',
                url: '/menu/tabs/category/ {"cats":["Electronique", "TV & Accessoires"]}'
            },
            {
                title: 'Accessoire',
                src: 'assets/hearset.svg',
                url: '/menu/tabs/category/ {"cats":["Electronique", "Accessoire"]}'
            }];
    }

    getHousePages(){
        return [
            {
                title: 'Home',
                src: 'assets/house-door-fill.svg',
                children: [
                    {
                        title: 'Chambre',
                        src: 'assets/bed.svg',
                        url: '/menu/tabs/category/ {"cats":["House", "Home", "Chambre"]}'
                    },
                    {
                        title: 'Salon',
                        src: 'assets/sofa.svg',
                        url: '/menu/abs/category/ {"cats":["House", "Home", "Salon"]}'
                    },
                    {
                        title: 'Salle de bain',
                        src: 'assets/bath.svg',
                        url: '/menu/tabs/category/ {"cats":["House", "Home", "Salle de bain"]}'
                    },
                    {
                        title: 'Cuisine',
                        src: 'assets/kitchen-cooker.svg',
                        url: '/menu/tabs/category/ {"cats":["House", "Home", "Cuisine"]}'
                    }
                ]
            },
            {
                title: 'Parking-Garden',
                src: 'assets/house-with-garden.svg',
                url: '/menu/tabs/category/ {"cats":["House", "Parking-Garden"]}'
            },
            {
                title: 'Electromenager',
                src: 'assets/refrigerator.svg',
                url: '/menu/tabs/category/ {"cats":["House", "Electromenager"]}'
            }
        ];
    }

    getWorkIndustriePages() {
        return [
            {
                title: 'Bureau',
                src: 'assets/office.svg',
                children: [
                    {
                        title: 'Professionel',
                        src: 'assets/storage.svg',
                        url: '/menu/tabs/category/ {"cats":["Office-industrie", "Bureau", "Professionel"]}'
                    },
                    {
                        title: 'Ecole',
                        src: 'assets/outline-school.svg',
                        url: '/menu/tabs/category/ {"cats":["Office-industrie", "Bureau", "Ecole"]}'
                    }
                ]
            },
            {
                title: 'Industrie',
                src: 'assets/industry.svg',
                url: '/menu/tabs/category/ {"cats":["Office-industrie", "Industrie"]}'
            }
        ];
    }

    getGadgetPages(){
        return [
            {
                title: 'Jeu',
                src: 'assets/strategy.svg',
                children: [
                    {
                        title: 'Jeu Video',
                        src: 'assets/nintendo-ds.svg',
                        url: '/menu/tabs/category/ {"cats":["Gadget", "Jeu", "Jeu_Video"]}'
                    },
                    {
                        title: 'Societe',
                        src: 'assets/poker-chip.svg',
                        url: '/menu/tabs/category/ {"cats":["Gadget", "Jeu", "Societe"]}'
                    },
                    {
                        title: 'Jouet',
                        src: 'assets/toy.svg',
                        url: '/menu/tabs/category/ {"cats":["Gadget", "Jeu", "Jouet"]}'
                    }]
            },
            {
                title: 'Divers',
                src: 'assets/dj.svg',
                url: '/menu/tabs/category/ {"cats":["Gadget", "Divers"]}'
            }
        ]
    }
}

