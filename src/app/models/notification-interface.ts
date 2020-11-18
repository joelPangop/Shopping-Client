import {Article} from './article-interface';
import {itemCart} from './itemCart-interface';

export interface Notification {
    _id?: string;
    title?: string;
    message: string;
    message_id?: string;
    utilisateurId?: string;
    article?: Article;
    item?: itemCart;
    avatar?: string;
    createdAt?: number;
    read?: boolean;
    sender: string;
    type?: string;
}
