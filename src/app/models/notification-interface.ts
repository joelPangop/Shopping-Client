import {Message} from './message-interface';
import {Article} from './article-interface';

export interface Notification {
    _id?: string;
    title?: string;
    message: string;
    message_id?: string;
    utilisateurId?: string;
    article: Article;
    avatar: string;
    createdAt?: number;
    read?: boolean;
    sender: string;
    type?: string;
}
