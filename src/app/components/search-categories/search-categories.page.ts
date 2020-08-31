import {Component, OnInit} from '@angular/core';
import {NavParams} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-search-categories',
    templateUrl: './search-categories.page.html',
    styleUrls: ['./search-categories.page.scss'],
})
export class SearchCategoriesPage implements OnInit {

    allCategory: boolean = true;
    categories: any[];
    choosenCategories: string[];
    popover;
    catOptionSubject: BehaviorSubject<any>;

    constructor(private navParams: NavParams) {
        this.categories = [
            'Automobile',
            'Auto',
            'Voiture',
            'Moto',
            'Camion',
            'Mode',
            'Vetement',
            'Homme',
            'Enfant',
            'Chaussure',
            'Accessoire',
            'Sport_Loisir',
            'Piece_Accessoire',
            'Depannage',
            'Electronique',
            'Ordinateur',
            'Laptop',
            'Desktop',
            'Telephone & Tablet',
            'Telephone',
            'Tablet',
            'TV & Accessoires',
            'House',
            'Home',
            'Chambre',
            'Salon',
            'Salle de bain',
            'Cuisine',
            'Parking-Garden',
            'Electromenager',
            'Office-industrie',
            'Bureau',
            'Professionel',
            'Ecole',
            'Industrie',
            'Gadget',
            'Jeu',
            'Jeu_Video',
            'Societe',
            'Jouet',
            'Divers'
        ];
        this.choosenCategories = [];

    }

    ngOnInit() {
        this.popover = this.navParams.get('popover');
        this.catOptionSubject = this.navParams.get('catOptionSubject');
    }

    ionViewDidLeave() {
        this.catOptionSubject.next(this.choosenCategories);
        // this.popover.dismiss(this.choosenCategories);
    }

    setCategory(l: string) {
        this.choosenCategories.push(l);

    }
}
