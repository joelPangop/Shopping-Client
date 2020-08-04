import {Store} from './store-interface';
import {ArticleStatus} from './ArticleStatus';

export interface Article {
    title: string;
    price: number;
    description: string;
    categories: string[];
    pictures: string[];
    likes?: string[];
    averageStar?: number;
    state: string;
    city: string;
    createdAt?: number;
    _id?: string;
    utilisateurId?: string;
    owner?: string;
    views?:number,
    store?: Store,
    colors?: string[],
    sizes?: string[],
    discountPrice?: number,
    availability: Availability;
    comments?: string[];
    status?: ArticleStatus;
    brands?: string;
    kilometers?: number;
    transmission?: string;
    model?: string;
    year?: number;
}

export interface Availability {
    available: boolean;
    type?: string;
    feed?: number;
    address?: string;
}
