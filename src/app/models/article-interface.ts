import {Store} from './store-interface';
import {ArticleStatus} from './ArticleStatus';

export interface Article {
    title: string;
    price: number;
    discountPrice?: number,
    price_changed_date: number;
    price_discounted?: boolean;
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
    availability: Availability;
    comments?: string[];
    status?: ArticleStatus;
    brands?: string;
    kilometers?: number;
    transmission?: string;
    model?: string;
    year?: number;
    quantity?: number;
    stripe_info?: any;
    price_info?: any;
}

export interface Availability {
    available: boolean;
    type?: string;
    feed?: number;
    address?: string;
}
