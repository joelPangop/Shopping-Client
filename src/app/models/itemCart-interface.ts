import {Article} from './article-interface';
import {itemStatus} from './itemStatus';

export interface itemCart {
    _id?: string;
    item: Article;
    qty: number;
    amount: number;
    status: itemStatus;
    order?: any;
}
