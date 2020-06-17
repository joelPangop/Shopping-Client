import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    categories = [];

    constructor() {
    }

    categoryList() {
        this.categories = [
            {
                id: 1,
                name: 'Women',
                image: 'assets/images/category/women-fashion.jpg'
            },
            {
                id: 2,
                name: 'Men',
                image: 'assets/images/category/men-fashion.jpg'
            },
            {
                id: 3,
                name: 'Bags',
                image: 'assets/images/category/luggage.jpg'
            },
            {
                id: 4,
                name: 'Watches',
                image: 'assets/images/category/watches.jpg'
            },
            {
                id: 5,
                name: 'Jewelry',
                image: 'assets/images/category/jewelry.jpg'
            },
            {
                id: 6,
                name: 'Shoes',
                image: 'assets/images/category/shoes.jpg'
            },
            {
                id: 7,
                name: 'Computer',
                image: 'assets/images/category/computer.jpg'
            },
            {
                id: 8,
                name: 'Electronics',
                image: 'assets/images/category/electronics.jpg'
            },
            {
                id: 9,
                name: 'Home',
                image: 'assets/images/category/home.jpg'
            },
            {
                id: 10,
                name: 'Baby Store',
                image: 'assets/images/category/baby.jpg'
            }
        ];

        return this.categories;
    }

    categoriesList() {
        this.categories = [
            {
                name: 'Mode',
                sousCat: [['Mode', 'Vetement', 'Homme'], ['Mode', 'Vetement', 'Femme'], ['Mode', 'Vetement', 'Enfant'],
                    ['Mode', 'Vetement', 'Bebe'], ['Mode', 'Chaussure', 'Homme'], ['Mode', 'Chaussure', 'Femme'],
                    ['Mode', 'Chaussure', 'Enfant'], ['Mode', 'Chaussure', 'Bebe'], ['Mode', 'Accessoire', 'Homme'],
                    ['Mode', 'Accessoire', 'Femme'], ['Mode', 'Accessoire', 'Enfant'], ['Mode', 'Accessoire', 'Bebe'], ['Mode', 'Sport_Loisir']],
                image: ['assets/images/category/women-fashion.jpg', 'assets/images/category/men-fashion.jpg', 'assets/images/category/luggage.jpg',
                    'assets/images/category/watches.jpg', 'assets/images/category/jewelry.jpg', 'assets/images/category/shoes.jpg',
                    'assets/images/category/boot.jpg']
            },
            {
                name: 'Electronique',
                sousCat: [['Electronique', 'Ordinateur', 'Laptop'], ['Electronique', 'Ordinateur', 'Desktop'], ['Electronique', 'Ordinateur', 'Accessoire'],
                    ['Electronique', 'Telephone'], ['Electronique', 'Accessoire'], ['Electronique', 'TV & Accessoires'], ['Electronique', 'Accessoire'],
                    ["Electronique", "digital"]],
                image: ['assets/images/category/electronics.jpg', 'assets/images/category/computer.jpg', 'assets/images/category/tv.jpg', 'assets/images/category/laptop.jpg',
                    'assets/images/category/desktop.jpg', 'assets/images/category/full-desktop.jpg', 'assets/images/category/keyboard.jpg', 'assets/images/category/screen.jpg',
                    'assets/images/category/printer.jpg', 'assets/images/category/wifi-router.jpg', 'assets/images/category/phone.jpg']
            },
            {
                name: 'Automobile',
                sousCat: [["Automobile", "Auto", "Voiture"], ["Automobile", "Auto", "Moto"], ["Automobile", "Auto", "Camion"],
                    ["Automobile", "Accessoire", "Piece_Accessoire"], ["Automobile", "Accessoire", "Depannage"]],
                image: ['assets/images/category/voiture.jpg', 'assets/images/category/voiture1.jpg', 'assets/images/category/voiture3.jpg',
                    'assets/images/category/truck.jpg', 'assets/images/category/truck2.jpg', 'assets/images/category/moto.jpg', 'assets/images/category/moto2.jpg',
                    'assets/images/category/cle.jpg', 'assets/images/category/engine.jpg', 'assets/images/category/engine2.jpg']
            },
            {
                name: 'House',
                sousCat: [['House', 'Home', 'Chambre'], ['House', 'Home', 'Salon'], ['House', 'Home', 'Salle de bain'], ['House', 'Home', 'Cuisine'],
                    ['House', 'Parking-Garden'], ['House', 'Electromenager']],
                image: ['assets/images/category/bed.jpg', 'assets/images/category/bed2.jpg', 'assets/images/category/bed_sheet.jpg',
                    'assets/images/category/armoire.jpg', 'assets/images/category/commode.jpg', 'assets/images/category/chambre1.jpg',
                    'assets/images/category/sofa.jpg', 'assets/images/category/sofa2.jpg', 'assets/images/category/sofa1.jpg',
                    'assets/images/category/freezer.jpg', 'assets/images/category/freezer2.jpg', 'assets/images/category/cooker.jpg',
                    'assets/images/category/cooker1.jpg', 'assets/images/category/cooker2.jpg', 'assets/images/category/bath.jpg',
                    'assets/images/category/bath1.jpg', 'assets/images/category/bath3.jpg', 'assets/images/category/sallemanger.jpg',
                    'assets/images/category/bath2.jpg', 'assets/images/category/lawn.jpg',
                ]
            },
            {
                name: 'Office-industrie',
                sousCat: [['Office-industrie', 'Bureau', 'Professionel'], ['Office-industrie', 'Bureau', 'Ecole'], ['Office-industrie', 'Industrie']],
                image: ['assets/images/category/office.jpg', 'assets/images/category/office-chair.jpg', 'assets/images/category/office1.jpg',
                    'assets/images/category/office-chair1.jpg', 'assets/images/category/office-table.jpg', 'assets/images/category/office-table1.jpg',
                    'assets/images/category/office2.jpg', 'assets/images/category/pencil.jpg', 'assets/images/category/pencil2.jpg',
                    'assets/images/category/ruler.jpg', 'assets/images/category/notebook.jpg', 'assets/images/category/notebook1.jpg',
                    'assets/images/category/industry.jpg', 'assets/images/category/industry1.jpg', 'assets/images/category/industry2.jpg'
                ]
            }
            ,
            {
                name: 'Gadget',
                sousCat: [['Gadget', 'Jeu', 'Jeu_Video'], ['Gadget', 'Jeu', 'Jouet'], ['Gadget', 'Jeu', 'Societe'], ['Gadget', 'Divers']],
                image: ['assets/images/category/ps.jpg', 'assets/images/category/ps1.jpg', 'assets/images/category/game.jpg',
                    'assets/images/category/game1.jpg', 'assets/images/category/baby.jpg', 'assets/images/category/toy.jpg',
                    'assets/images/category/toy1.jpg', 'assets/images/category/toy3.jpeg', 'assets/images/category/toy2.jpg',
                    'assets/images/category/ludo.jpg', 'assets/images/category/scrabble.jpg'
                ]
            }
        ];
        return this.categories;
    };
}
